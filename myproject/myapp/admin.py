from django.contrib import admin
from .models import User, UserProfile, Recipe, Review, ShopItem

# Register your models here.
admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Recipe)
admin.site.register(Review)
admin.site.register(ShopItem)
