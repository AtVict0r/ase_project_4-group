from django import forms
from .models import User
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class DeleteAccountForm(forms.Form):
    confirm = forms.BooleanField(required=True, label="I confirm that I want to delete my account")

class PasswordChangeFormCustom(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput, label="Current Password")
    new_password = forms.CharField(widget=forms.PasswordInput, label="New Password")
    confirm_new_password = forms.CharField(widget=forms.PasswordInput, label="Confirm New Password")

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean_old_password(self):
        old_password = self.cleaned_data.get('old_password')
        if not self.user.check_password(old_password):
            raise ValidationError("Old password is incorrect.")
        return old_password

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get("new_password")
        confirm_new_password = cleaned_data.get("confirm_new_password")

        if new_password and confirm_new_password:
            if new_password != confirm_new_password:
                raise forms.ValidationError("New password and confirm new password do not match.")
        return cleaned_data

class ChangeFirstNameForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name']

class ChangeLastNameForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['last_name']

class ChangeEmailForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already in use")
        return email
