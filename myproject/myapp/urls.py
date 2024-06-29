from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from myproject.myapp import views



urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls),
    path('login/', views.login_view, name='login'),
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
    path('about/', views.about, name='about'),
    
    # Recipe URLs
    path('recipes/', views.recipes, name='recipes'),
    path('recipes/edit/<int:recipe_id>/', views.edit_recipe, name='edit_recipe'),
    path('recipes/<int:pk>/', views.recipe_detail, name='recipe_detail'),
    path('recipes/new/', views.new_recipe, name='new_recipe'),
    path('recipes/add/', views.add_recipe, name='add_recipe'),
    path('recipes/post/', views.post_recipe, name='post_recipe'),
    path('recipes/delete/', views.delete_recipe, name='delete_recipe'),
    path('recipes/remove/', views.remove_recipe, name='remove_recipe'),
    path('recipes/get_all/', views.get_all_recipes, name='get_all_recipes'),
    path('recipes/get/<int:recipe_id>/', views.get_recipe, name='get_recipe'),
    path('recipes/update/', views.update_recipe, name='update_recipe'),
    
    path('thankyou/', views.thankyou, name='thankyou'),
    path('thankyou_add/', views.thankyou_add, name='thankyou_add'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('get-imageurl/', views.get_imageurl, name='get_imageurl'),
    
    # API URLs
    path('api/get_profile/', views.get_profile, name='get_profile'),
    path('api/update_email/', views.update_email, name='update_email'),
    path('api/update_password/', views.update_password, name='update_password'),
    path('api/update_name/', views.update_name, name='update_name'),
    path('api/delete_account/', views.delete_account, name='delete_account'),
    path('api/get_user_info/', views.get_user_info, name='get_user_info'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile-settings/', views.profile_settings, name='profile_settings'),
    path('change-first-name/', views.change_first_name, name='change_first_name'),
    path('change-last-name/', views.change_last_name, name='change_last_name'),
    path('change-email/', views.change_email, name='change_email'),
    path('change-password/', views.change_password, name='change_password'),
    path('delete-account/', views.delete_account, name='delete_account'),


    # Profile settings URLs
    path('profile/settings/', views.profile_settings, name='profile_settings'),

    # Review URLs
    path('reviews/create/', views.create_review, name='create_review'),
    path('reviews/all/', views.get_all_reviews, name='get_all_reviews'),
    path('reviews/', views.get_review, name='get_review'),
    path('reviews/update/', views.update_review, name='update_review'),
    path('reviews/delete/', views.delete_review, name='delete_review'),

    # Shop item URLs
    path('shop-items/', views.get_all_shop_items, name='get_all_shop_items'),
    path('shop-items/<int:item_id>/', views.get_shop_item, name='get_shop_item'),
    path('shop-items/create/', views.post_shop_item, name='post_shop_item'),
    path('shop-items/delete/', views.delete_shop_item, name='delete_shop_item'),
    path('shop-items/update/', views.update_shop_item, name='update_shop_item'),
]
