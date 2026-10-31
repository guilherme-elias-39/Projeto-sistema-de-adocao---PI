from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.



class Usuario(AbstractUser):
    nome = models.CharField(max_length=150)
    cpf = models.CharField(max_length=14, unique=True)
    email = models.EmailField(unique=True)

    REQUIRED_FIELDS = ['email', 'nome', 'cpf']

    def __str__(self):
        return self.nome



class Instituicao(models.Model):
    nome = models.CharField(max_length=150)

    cnpj = models.CharField(
        max_length=18,
        unique=True,
        null=True,
        blank=True
    )

    descricao = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    telefone = models.CharField(max_length=20, blank=True)

    cidade = models.CharField(
        max_length=100,
        blank=True
    )

    endereco = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.nome


class Animal(models.Model):
    ESPECIES = [
        ('cachorro', 'Cachorro'),
        ('gato', 'Gato'),
        ('outro', 'Outro'),
    ]

    SITUACOES = [
        ('disponivel', 'Disponível para adoção'),
        ('adotado', 'Adotado'),
    ]

    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=20, choices=ESPECIES)
    descricao = models.TextField(blank=True)
    caracteristicas = models.TextField(blank=True)
    raca = models.CharField(max_length=100, blank=True)
    idade = models.PositiveIntegerField(null=True, blank=True)
    imagem = models.ImageField(
        upload_to='animais/',
        null=True,
        blank=True
    )
    situacao = models.CharField(
        max_length=20,
        choices=SITUACOES,
        default='disponivel'
    )
    instituicao = models.ForeignKey(
        Instituicao,
        on_delete=models.CASCADE,
        related_name='animais'
    )

    def __str__(self):
        return self.nome


class Agendamento(models.Model):
    SITUACOES = [
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('cancelado', 'Cancelado'),
        ('concluido', 'Concluído'),
    ]

    usuario = models.ForeignKey(
        'core.Usuario',
        on_delete=models.CASCADE,
        related_name='agendamentos'
    )
    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        related_name='agendamentos'
    )
    data = models.DateField()
    horario = models.TimeField()
    situacao = models.CharField(
        max_length=20,
        choices=SITUACOES,
        default='pendente'
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['animal', 'data', 'horario'],
                name='agendamento_unico_por_animal_data_horario'
            )
        ]

    def __str__(self):
        return f'{self.animal.nome} - {self.data} {self.horario}'



class Conversa(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='conversas'
    )
    instituicao = models.ForeignKey(
        Instituicao,
        on_delete=models.CASCADE,
        related_name='conversas'
    )
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'instituicao')

    def __str__(self):
        return f'{self.usuario.nome} - {self.instituicao.nome}'


class Mensagem(models.Model):
    conversa = models.ForeignKey(
        Conversa,
        on_delete=models.CASCADE,
        related_name='mensagens'
    )
    remetente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='mensagens_enviadas'
    )
    conteudo = models.TextField(max_length=2000)
    enviada_em = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    class Meta:
        ordering = ['enviada_em']

    def __str__(self):
        return f'Mensagem de {self.remetente.nome}'


class Notificacao(models.Model):
    CATEGORIAS = [
        ('agendamento', 'Agendamento'),
        ('mensagem', 'Mensagem'),
        ('animal', 'Animal'),
        ('conta', 'Conta'),
    ]

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='notificacoes'
    )
    titulo = models.CharField(max_length=150)
    descricao = models.TextField()
    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS
    )
    criada_em = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    class Meta:
        ordering = ['-criada_em']

    def __str__(self):
        return self.titulo

