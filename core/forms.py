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
    email = forms.EmailField(max_length=150)
    telefone = forms.CharField(max_length=20)
    cidade = forms.CharField(max_length=100)
    endereco = forms.CharField(max_length=200)
    descricao = forms.CharField(
        max_length=1000,
        widget=forms.Textarea()
    )

    def clean_cnpj(self):
        cnpj = self.cleaned_data['cnpj']
        numeros_cnpj = ''.join(filter(str.isdigit, cnpj))

        if len(numeros_cnpj) != 14 or numeros_cnpj == numeros_cnpj[0] * 14:
            raise forms.ValidationError('digite um CNPJ válido.')

        soma = 0
        pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

        for i in range(12):
            soma += int(numeros_cnpj[i]) * pesos[i]

        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto

        soma = 0
        pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

        for i in range(13):
            if i == 12:
                soma += digito1 * pesos[i]
            else:
                soma += int(numeros_cnpj[i]) * pesos[i]

        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto

        if numeros_cnpj[12] != str(digito1) or numeros_cnpj[13] != str(digito2):
            raise forms.ValidationError('Informe um CNPJ válido.')

        cnpj_formatado = (
            numeros_cnpj[:2] + '.' +
            numeros_cnpj[2:5] + '.' +
            numeros_cnpj[5:8] + '/' +
            numeros_cnpj[8:12] + '-' +
            numeros_cnpj[12:]
        )

        if Instituicao.objects.filter(cnpj=cnpj_formatado).exists():
            raise forms.ValidationError('Este CNPJ já está cadastrado.')

        return cnpj_formatado

    def clean_email(self):
        email = self.cleaned_data['email']

        if Instituicao.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                'Este e-mail já está cadastrado.'
            )

        return email

    
    def clean_telefone(self):
        telefone = self.cleaned_data['telefone']
        numeros = ''.join(filter(str.isdigit, telefone))

        if len(numeros) < 10 or len(numeros) > 13:
            raise forms.ValidationError('Informe um telefone válido.')

        telefones_cadastrados = Instituicao.objects.exclude(
            telefone=''
        ).values_list('telefone', flat=True)

        for telefone_cadastrado in telefones_cadastrados:
            numeros_cadastrados = ''.join(
                filter(str.isdigit, telefone_cadastrado)
            )

            if numeros == numeros_cadastrados:
                raise forms.ValidationError(
                    'Este telefone já está cadastrado.'
                )

        return telefone



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
