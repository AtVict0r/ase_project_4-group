from django.contrib import admin
from django.urls import path, re_path
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Import views directly from myapp
from myproject.myapp import views
from myproject.myapp.views import IndexView



urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('api/admin', admin.site.urls),
    path('api/login', views.login_view, name='login'),
    path('api/csrf-token', views.get_csrf_token, name='csrf-token'),
    path('api/about', views.about, name='about'),
    
    # Recipe URLs
    path('api/recipes', views.recipes, name='recipes'),
    path('api/recipes/edit/<int:recipe_id>', views.edit_recipe, name='edit_recipe'),
    path('api/recipes/<int:pk>', views.recipe_detail, name='recipe_detail'),
    path('api/recipes/new', views.new_recipe, name='new_recipe'),
    path('api/recipes/add', views.add_recipe, name='add_recipe'),
    path('api/recipes/post', views.post_recipe, name='post_recipe'),
    path('api/recipes/delete/<int:id>', views.delete_recipe, name='delete_recipe'),
    path('api/recipes/remove', views.remove_recipe, name='remove_recipe'),
    path('api/recipes/get_all', views.get_all_recipes, name='get_all_recipes'),
    path('api/get_all_recipes', views.get_all_recipes, name='get_all_recipes'),
    path('api/recipes/get/<int:recipe_id>', views.get_recipe, name='get_recipe'),
    path('api/recipes/update/<int:id>', views.edit_recipe, name='edit_recipe'),
    
    path('api/thankyou/', views.thankyou, name='thankyou'),
    path('api/thankyou_add/', views.thankyou_add, name='thankyou_add'),
    path('api/register/', views.register_view, name='register_view'),
    path('api/signup', views.SignupView.as_view(), name='signup'),
    path('api/get-imageurl', views.get_imageurl, name='get_imageurl'),
    
    # API URLs
    path('api/get_profile', views.get_profile, name='get_profile'),
    path('api/update_email', views.update_email, name='update_email'),
    path('api/update_password', views.update_password, name='update_password'),
    path('api/update_name', views.update_name, name='update_name'),
    path('api/delete_account', views.delete_account, name='delete_account'),
    path('api/get_user_info', views.get_user_info, name='get_user_info'),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile-settings', views.profile_settings, name='profile_settings'),
    path('api/change-first-name', views.change_first_name, name='change_first_name'),
    path('api/change-last-name', views.change_last_name, name='change_last_name'),
    path('api/change-email', views.change_email, name='change_email'),
    path('api/change-password', views.change_password, name='change_password'),
    path('api/delete-account', views.delete_account, name='delete_account'),


    # Profile settings URLs
    path('api/profile/settings', views.profile_settings, name='profile_settings'),

    # Review URLs
    path('api/reviews/create', views.create_review, name='create_review'),
    path('api/reviews/all', views.get_all_reviews, name='get_all_reviews'),
    path('api/reviews', views.get_review, name='get_review'),
    path('api/reviews/update', views.update_review, name='update_review'),
    path('api/reviews/delete', views.delete_review, name='delete_review'),

    # Shop item URLs
    path('api/shop-items', views.get_all_shop_items, name='get_all_shop_items'),
    path('api/shop-items/<int:item_id>', views.get_shop_item, name='get_shop_item'),
    path('api/shop-items/create', views.post_shop_item, name='post_shop_item'),
    path('api/shop-items/delete', views.delete_shop_item, name='delete_shop_item'),
    path('api/shop-items/update', views.update_shop_item, name='update_shop_item'),
]  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
