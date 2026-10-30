from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from .models import Animal, Instituicao
from django.http import Http404
# Create your views here.

def confirmacao(request):
    return render(request, 'core/confirmacao.html')

def home(request):
    return render(request, 'home.html')

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.db import IntegrityError






def cadastro_usuario(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        cpf = request.POST.get('cpf', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '')
        confirmar_senha = request.POST.get('confirmar_senha', '')

        if not all([nome, cpf, email, senha, confirmar_senha]):
            messages.error(request, 'Preencha todos os campos.')
            return render(request, 'core/cadastro_usuario.html')

        if senha != confirmar_senha:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'core/cadastro_usuario.html')

        Usuario = get_user_model()

        if Usuario.objects.filter(email=email).exists():
            messages.error(request, 'Este e-mail já está cadastrado.')
            return render(request, 'core/cadastro_usuario.html')

        if Usuario.objects.filter(cpf=cpf).exists():
            messages.error(request, 'Este CPF já está cadastrado.')
            return render(request, 'core/cadastro_usuario.html')

        try:
            usuario = Usuario.objects.create_user(
                username=email,
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



def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha', '')

        Usuario = get_user_model()

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            messages.error(request, 'E-mail ou senha incorretos.')
            return render(request, 'core/login.html')

        usuario_autenticado = authenticate(
            request,
            username=usuario.username,
            password=senha
        )

        if usuario_autenticado is not None:
            auth_login(request, usuario_autenticado)
            return redirect('pagina_principal')

        messages.error(request, 'E-mail ou senha incorretos.')
        return render(request, 'core/login.html')

    return render(request, 'core/login.html')


def pesquisa_pets(request):
    termo = request.GET.get('q', '').strip()

    pets = Animal.objects.filter(
        # Mantenha aqui os filtros de disponibilidade
        # que sua função já utiliza, se houver.
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
        'core/pesquisa_pets.html',
        {
            'pets': pets,
            'termo': termo,
        }
    )


def pagina_principal(request):
    pets = Animal.objects.filter(
        situacao='disponivel'
    ).select_related('instituicao').order_by('-id')[:4]

    return render(request, 'core/pagina_principal.html', {
        'pets': pets,
    })

from django.db.models import Q

def pesquisa_instituicoes(request):
    termo = request.GET.get('q', '').strip()

    instituicoes = Instituicao.objects.all()

    if termo:
        instituicoes = instituicoes.filter(
            Q(nome__icontains=termo) |
            Q(cidade__icontains=termo) |
            Q(descricao__icontains=termo)
        )

    instituicoes = instituicoes.order_by('nome')

    return render(
        request,
        'core/pesquisa_instituicoes.html',
        {
            'instituicoes': instituicoes,
            'termo': termo,
        }
    )



def perfil_animal(request, animal_id):
    animal = Animal.objects.filter(
        id=animal_id
    ).select_related('instituicao').first()

    if animal is None:
        raise Http404("Animal não encontrado.")

    return render(
        request,
        'core/animal.html',
        {'animal': animal}
    )
















def cadastro_instituicao(request):
    return render(request, 'core/cadastro_instituicao.html')




def agendar_visita(request):
    return render(request, 'core/agendar_visitas.html')





def perfil_ong(request):
    return render(request, 'core/perfil_ong.html')

def mensagens(request):
    return render(request, 'core/mensagens.html')

def perfil_usuario(request):
    return render(request, 'core/perfil_usuario.html')

def agendamentos(request):
    return render(request, 'core/agendamentos.html')

def notificacoes(request):
    return render(request, 'core/notificacoes.html')

def agend_completo(request):
    return render(request, "core/agend_completo.html")

