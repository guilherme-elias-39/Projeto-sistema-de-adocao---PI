from django.shortcuts import render

# Create your views here.

def confirmacao(request):
    return render(request, 'core/confirmacao.html')

def home(request):
    return render(request, 'home.html')

def cadastro_usuario(request):
    return render(request, 'core/cadastro_usuario.html')


def cadastro_instituicao(request):
    return render(request, 'core/cadastro_instituicao.html')


def pesquisa_pets(request):
    return render(request, 'core/pesquisa_pets.html')


def pesquisa_instituicoes(request):
    return render(request, 'core/pesquisa_instituicoes.html')


def agendar_visita(request):
    return render(request, 'core/agendar_visitas.html')


def login(request):
    return render(request, 'core/login.html')


def perfil_animal(request):
    return render(request, 'core/animal.html')


def pagina_principal(request):
    return render(request, 'core/pagina_principal.html')
