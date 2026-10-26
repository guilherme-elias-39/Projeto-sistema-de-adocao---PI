from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class Usuario(AbstractUser):
    nome = models.CharField(max_length=150)
    cpf = models.CharField(max_length=14, unique=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nome


class Instituicao(models.Model):
    nome = models.CharField(max_length=150)
    descricao = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    telefone = models.CharField(max_length=20, blank=True)
    cidade = models.CharField(max_length=100)
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
