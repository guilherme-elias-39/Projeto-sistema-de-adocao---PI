from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import Animal, Instituicao, Agendamento, Conversa, Usuario, Notificacao
from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Q


def login(request):
    if request.method == 'POST':  # Se info do user foi pelo método de envio 
        email = request.POST.get('email', '').strip() # Acessa os dados do forms, procura o campo, se não vazio. Ao final remove espaços vazios
        senha = request.POST.get('senha', '')

        Usuario = get_user_model() # Modelo de usuário está sendo

        try:
            usuario = Usuario.objects.get(email=email) # Usuário cadastrado com e-mail informado?
        except Usuario.DoesNotExist:
            messages.error(request, 'E-mail ou senha incorretos.') # Se não, mensagem de erro
            return render(request, 'core/login.html')

        # A função authenticate do Django para verificar a senha
        usuario_autenticado = authenticate(request,
            username=usuario.username, password=senha
        )

        if usuario_autenticado is not None:
            auth_login(request, usuario_autenticado) # Armazena a verificação
            return redirect('pagina_principal')
        # Se nao for bem sucedida
        messages.error(request, 'E-mail ou senha incorretos.')
        return render(request, 'core/login.html')

    return render(request, 'core/login.html')



def cadastro_usuario(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip() # Captura info do user do forms
        cpf = request.POST.get('cpf', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '')
        confirmar_senha = request.POST.get('confirmar_senha', '')

        if not all([nome, cpf, email, senha, confirmar_senha]): # Campos verdadeiros?
            messages.error(request, 'Preencha todos os campos.')
            return render(request, 'core/cadastro_usuario.html')

        if senha != confirmar_senha: # != diferente
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'core/cadastro_usuario.html')

        Usuario = get_user_model() # Recupera modelo

        if Usuario.objects.filter(email=email).exists(): # exists = tem algum resultado
            messages.error(request, 'Este e-mail já está cadastrado.')
            return render(request, 'core/cadastro_usuario.html')

        if Usuario.objects.filter(cpf=cpf).exists():
            messages.error(request, 'Este CPF já está cadastrado.')
            return render(request, 'core/cadastro_usuario.html')

        try:
            usuario = Usuario.objects.create_user( # cria o user no banco
                username=email, # email como nome do user
                nome=nome,
                cpf=cpf,
                email=email,
                password=senha,
            )
        except IntegrityError:
            messages.error(
                request,
                'Não foi possível concluir o cadastro. Verifique os dados.'
            )
            return render(request, 'core/cadastro_usuario.html')

        messages.success(request, 'Cadastro realizado com sucesso!')
        return redirect('login')

    return render(request, 'core/cadastro_usuario.html')



def cadastro_instituicao(request):
    if request.method == 'POST':
        nome = request.POST.get('nome_instituicao', '').strip()
        cnpj = request.POST.get('cnpj', '').strip()
        contato = request.POST.get('contato', '').strip()
        endereco = request.POST.get('endereco', '').strip()
        descricao = request.POST.get('descricao', '').strip()

        if not all([nome, cnpj, contato, endereco, descricao]):
            messages.error(request, 'Preencha todos os campos.')
            return render(request, 'core/cadastro_instituicao.html')

        numeros_cnpj = ''.join(filter(str.isdigit, cnpj)) # str.isdigit = cada caracter é número? Junta sem espaço

        if len(numeros_cnpj) != 14:
            messages.error(request, 'Informe um CNPJ válido.')
            return render(request, 'core/cadastro_instituicao.html')

        if Instituicao.objects.filter(cnpj=cnpj).exists():
            messages.error(request, 'Este CNPJ já está cadastrado.')
            return render(request, 'core/cadastro_instituicao.html')
        # contato é email ou telefone?
        if '@' in contato:
            email = contato
            telefone = ''
        else:
            email = ''
            telefone = contato

        try:
            Instituicao.objects.create(
                nome=nome,
                cnpj=cnpj,
                email=email,
                telefone=telefone,
                endereco=endereco,
                descricao=descricao
            )
        except IntegrityError:
            messages.error(request, 'Não foi possível realizar o cadastro.')
            return render(request, 'core/cadastro_instituicao.html')

        messages.success(request, 'ONG cadastrada com sucesso!')
        return redirect('login')

    return render(request, 'core/cadastro_instituicao.html')



def pagina_principal(request):
    pets = Animal.objects.filter(
        situacao='disponivel'
    ).select_related('instituicao').order_by('-id')[:4] # limita o resultado do animal aos 4 primeiros, decrescente.

    return render(request, 'core/pagina_principal.html', {
        'pets': pets,
    })




def pesquisa_pets(request):
    termo = request.GET.get('q', '').strip()

    pets = Animal.objects.filter(
    )

    if termo:
        pets = pets.filter(
            Q(nome__icontains=termo) |
            Q(especie__icontains=termo) |
            Q(caracteristicas__icontains=termo) |
            Q(instituicao__nome__icontains=termo) |
            Q(instituicao__cidade__icontains=termo)
        )

    return render(
        request,
        'core/pesquisa_pets.html',{'pets': pets, 'termo': termo,
        }
    )



def pesquisa_instituicoes(request):
    termo = request.GET.get('q', '').strip() # pesquisa

    instituicoes = Instituicao.objects.all() # retoma todos os registros da instituição

    if termo:
        instituicoes = instituicoes.filter(
            Q(nome__icontains=termo) |
            Q(cidade__icontains=termo) |
            Q(descricao__icontains=termo)
        )

    instituicoes = instituicoes.order_by('nome')

    return render(
        request,
        'core/pesquisa_instituicoes.html',{'instituicoes': instituicoes,'termo': termo,
        }
    )



def perfil_animal(request, animal_id):
    animal = Animal.objects.filter(id=animal_id
    ).select_related('instituicao').first() # first=retorna o primeiro resultado encontrado.

    if animal is None:
        raise Http404("Animal não encontrado.")

    return render(request,'core/animal.html',{'animal': animal}
    )






@login_required(login_url='login')
def agendar_visita(request, animal_id):
    animal = Animal.objects.filter(id=animal_id).first()

    if animal is None:
        raise Http404("Animal não encontrado.")

    if request.method == 'POST':
        data = request.POST.get('data')
        periodo = request.POST.get('periodo')

        if periodo == 'manha':
            horario = '10:00'
        elif periodo == 'tarde':
            horario = '15:00'
        else:
            messages.error(request, 'Selecione um período válido.')
            return render(
                request,
                'core/agendar_visitas.html',
                {'animal': animal}
            )

        try:
            agendamento = Agendamento.objects.create(
                usuario=request.user,
                animal=animal,
                data=data,
                horario=horario
            )
        except Exception:
            messages.error(
                request,
                'Não foi possível realizar o agendamento. Verifique a data e o horário.'
            )
            return render(
                request,
                'core/agendar_visitas.html',
                {'animal': animal}
            )

        return redirect(
            'agend_completo',
            agendamento_id=agendamento.id
        )

    return render(
        request,
        'core/agendar_visitas.html',
        {'animal': animal}
    )





def perfil_ong(request, ong_id):

    ong = get_object_or_404(Instituicao, id=ong_id) #procura um registro banco de dados

    animais = Animal.objects.filter( #objects permite cunsultar e filter seleciona registros
        instituicao=ong, #seleciona apenas os animais vinculados à ong
        situacao='disponivel' 
    )

    total_animais = animais.count()

    return render(request, 'core/perfil_ong.html', {
        'ong': ong,
        'animais': animais,
        'total_animais': total_animais,
    }) #envio do template juntos com as informações

def mensagens(request):

    conversas = Conversa.objects.filter(
        usuario=request.user 
    ).select_related('instituicao').prefetch_related('mensagens') 
    #select_related permite obter os dados da ong junto com o da conversa.
    #prefetch_related acessa mensagens relacionadas a uma conversa

    return render(request, 'core/mensagens.html', {
        'conversas': conversas, #envia as conversas para o templ que apres. cada uma
    })


@login_required
def perfil_usuario(request): #usuario atent, vizualize e altere o perfil

    usuario = request.user #objeto correspondente ao usuário autenticado
    mensagem = ''

    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')

        if not nome or not email:
            mensagem = 'Preencha todos os campos obrigatórios.'

        else:
            usuario.nome = nome
            usuario.email = email
            usuario.save()

            mensagem = 'Dados atualizados com sucesso!'

    return render(request, 'core/perfil_usuario.html', {
        'usuario': usuario,
        'mensagem': mensagem,
    })

@login_required(login_url='login')
def agendamentos(request):

    agendamentos = Agendamento.objects.filter(
        usuario=request.user #agendamentos relacionados ao usuário
    ).select_related('animal', 'animal__instituicao').order_by('-id')
#select_related- recurso Django ORM para buscar os dados de objetos numa única consulta, sem várias ao banco.

    return render(
        request,
        'core/agendamentos.html',
        {'agendamentos': agendamentos}
    )

@login_required
def notificacoes(request):

    notificacoes = Notificacao.objects.filter(usuario=request.user) #Consulta o model Notificacao e as notificações do usuário conectado.

    total = notificacoes.count()
    nao_lidas = notificacoes.filter(lida=False).count()
    lidas = notificacoes.filter(lida=True).count()

    return render(request, 'core/notificacoes.html', {
        'notificacoes': notificacoes,
        'total': total,
        'nao_lidas': nao_lidas,
        'lidas': lidas,
    }) #Envia as notificações e os resultados para o template

@login_required(login_url='login')
def agend_completo(request, agendamento_id):

    agendamento = Agendamento.objects.filter( #acessa, consulta e verifica se pertence ao user
        id=agendamento_id, #busca o agendamento
        usuario=request.user #verifica se foi feito pelo usuário
    ).select_related('animal', 'animal__instituicao').first() 
    #first retorna o primeiro objeto encontrado ou None, caso nenhum registro corresponda ao dados durante consulta.

    if agendamento is None:
        raise Http404("Agendamento não encontrado!") #caso o usuário tente acessar um agendamento inexistente
    
    if request.method == 'POST':
        if request.POST.get('cancelar_agendamento') == '1': #verifica se o formulário enviado está relacionado ao cancelamento
            if agendamento.situacao != 'cancelado':
                agendamento.situacao = 'cancelado'
                agendamento.save(update_fields=['situacao'])
                messages.success(request, 'Agendamento cancelado com sucesso!')

            return redirect('agendamentos')

    return render(request,'core/agend_completo.html',{'agendamento': agendamento})



