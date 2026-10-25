from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Instituicao, Animal, Agendamento


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = (
        'username', 'nome', 'email', 'cpf',
        'is_staff', 'is_active',
    )
    search_fields = ('username', 'nome', 'email', 'cpf')
    list_filter = ('is_staff', 'is_active', 'is_superuser')

    fieldsets = UserAdmin.fieldsets + (
        ('Dados do Pet&Love', {
            'fields': ('nome', 'cpf'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Dados do Pet&Love', {
            'classes': ('wide',),
            'fields': ('nome', 'cpf', 'email'),
        }),
    )


@admin.register(Instituicao)
class InstituicaoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cidade', 'email', 'telefone')
    search_fields = ('nome', 'cidade', 'email')
    list_filter = ('cidade',)
    ordering = ('nome',)


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = (
        'nome', 'especie', 'raca', 'idade',
        'instituicao', 'situacao',
    )
    search_fields = (
        'nome', 'raca', 'caracteristicas',
        'instituicao__nome', 'instituicao__cidade',
    )
    list_filter = ('especie', 'situacao', 'instituicao')
    list_editable = ('situacao',)
    list_select_related = ('instituicao',)
    ordering = ('nome',)
    list_per_page = 20


@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    list_display = (
        'animal', 'usuario', 'data',
        'horario', 'situacao', 'criado_em',
    )
    search_fields = (
        'animal__nome', 'usuario__nome',
        'usuario__email', 'animal__instituicao__nome',
    )
    list_filter = ('situacao', 'data')
    date_hierarchy = 'data'
    readonly_fields = ('criado_em',)
    list_select_related = ('animal', 'usuario')
    ordering = ('-data', '-horario')
    list_per_page = 20
