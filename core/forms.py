from django import forms
from django.contrib.auth import get_user_model
from .models import Instituicao


Usuario = get_user_model()


class LoginForm(forms.Form):
    email = forms.EmailField(
        label='E-mail',
        widget=forms.EmailInput(attrs={
            'placeholder': 'E-mail',
            'autocomplete': 'email'
        })
    )

    senha = forms.CharField(
        label='Senha',
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Senha',
            'autocomplete': 'current-password'
        })
    )


class CadastroUsuarioForm(forms.Form):
    nome = forms.CharField(max_length=150)
    cpf = forms.CharField(max_length=14)
    email = forms.EmailField()
    senha = forms.CharField( min_length=8, widget=forms.PasswordInput())
    confirmar_senha = forms.CharField(widget=forms.PasswordInput())

    def clean_cpf(self):
        cpf = self.cleaned_data['cpf']

        if Usuario.objects.filter(cpf=cpf).exists():
            raise forms.ValidationError('Este CPF já está cadastrado.')

        return cpf

    def clean_email(self):
        email = self.cleaned_data['email']

        if Usuario.objects.filter(email=email).exists():
            raise forms.ValidationError('Este e-mail já está cadastrado.')

        return email

    def clean(self):
        dados = super().clean()

        senha = dados.get('senha')
        confirmar_senha = dados.get('confirmar_senha')

        if senha and confirmar_senha and senha != confirmar_senha:
            self.add_error(
                'confirmar_senha',
                'As senhas não coincidem.'
            )

        return dados


class CadastroInstituicaoForm(forms.Form):
    nome_instituicao = forms.CharField(max_length=150)
    cnpj = forms.CharField(max_length=18)
    contato = forms.CharField(max_length=150)
    endereco = forms.CharField(max_length=200)
    descricao = forms.CharField(widget=forms.Textarea())

    def clean_cnpj(self):
        cnpj = self.cleaned_data['cnpj']
        numeros_cnpj = ''.join(filter(str.isdigit, cnpj))

        if len(numeros_cnpj) != 14:
            raise forms.ValidationError('Informe um CNPJ válido.')

        if Instituicao.objects.filter(cnpj=cnpj).exists():
            raise forms.ValidationError('Este CNPJ já está cadastrado.')

        return cnpj

    def clean_contato(self):
        contato = self.cleaned_data['contato']

        if '@' in contato:
            forms.EmailField().clean(contato)

        return contato


class AgendamentoForm(forms.Form):
    PERIODOS = [
        ('manha', 'Manhã'),
        ('tarde', 'Tarde'),
    ]

    data = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'})
    )

    periodo = forms.ChoiceField(choices=PERIODOS)


class PerfilUsuarioForm(forms.Form):
    nome = forms.CharField(max_length=150)
    email = forms.EmailField()

    def __init__(self, *args, **kwargs):
        self.usuario = kwargs.pop('usuario', None)
        super().__init__(*args, **kwargs)

    def clean_email(self):
        email = self.cleaned_data['email']

        if Usuario.objects.filter(email=email).exclude(
            pk=self.usuario.pk
        ).exists():
            raise forms.ValidationError(
                'Este e-mail já está sendo utilizado.'
            )

        return email


class MensagemForm(forms.Form):
    conteudo = forms.CharField(
        max_length=2000,
        widget=forms.Textarea(attrs={
            'placeholder': 'Digite sua mensagem...',
            'rows': 3
        })
    )
