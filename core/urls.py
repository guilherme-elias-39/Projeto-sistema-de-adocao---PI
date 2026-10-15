from django.urls import path
from . import views

urlpatterns = [
    path('inicio/', views.inicio, name='inicio'),
    path('pagina-principal/', views.pagina_principal, name='pagina_principal'),
    path('cadastro/usuario/', views.cadastro_usuario, name='cadastro_usuario'),
    path('cadastro/instituicao/', views.cadastro_instituicao, name='cadastro_instituicao'),
    path('pesquisa/pets/', views.pesquisa_pets, name='pesquisa_pets'),
    path('pesquisa/instituicoes/', views.pesquisa_instituicoes, name='pesquisa_instituicoes'),
    path('agendar-visita/', views.agendar_visita, name='agendar_visita'),
    path('', views.login, name='login'),
    path('animal/', views.perfil_animal, name='perfil_animal'),
]
