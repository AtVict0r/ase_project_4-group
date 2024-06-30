from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseRedirect, Http404
from django.contrib.auth import authenticate, update_session_auth_hash, login as auth_login
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from urllib.parse import urlencode
import json
import jwt
from datetime import datetime, timedelta
import logging

from .models import User, Recipe, Review, ShopItem
from .forms import ProfileUpdateForm, DeleteAccountForm, PasswordChangeFormCustom
from .serializers import ReviewSerializer, ShopItemSerializer
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_POST
import json

logger = logging.getLogger(__name__)
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, requires_csrf_token
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
import json
from django.contrib.auth import get_user_model
import bcrypt

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import authenticate, login
from urllib.parse import urlparse
from django.contrib.auth.views import LoginView
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.shortcuts import render, get_list_or_404
from .models import Recipe




@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.COOKIES.get('csrftoken')})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError

@api_view(['POST'])
def register_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')

    if not email or not password or not first_name or not last_name:
        return Response({'error': 'All fields are required.'}, status=400)

    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        return Response({'message': 'User created successfully.'}, status=201)
    except IntegrityError:
        return Response({'error': 'A user with that email already exists.'}, status=400)


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid Credentials'}, status=400)
@csrf_exempt
@login_required
def get_profile(request):
    try:
        user = request.user
        return JsonResponse({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        })
    except Exception as e:
        return JsonResponse({'message': f'Error fetching profile: {str(e)}'}, status=500)

# Additional view functions for updating email, password, and name
@csrf_exempt
@require_http_methods(["PUT"])
@login_required
def update_email(request):
    try:
        data = json.loads(request.body)
        new_email = data.get('email')

        if not new_email:
            return JsonResponse({'message': 'New email is required.'}, status=400)

        if User.objects.filter(email=new_email).exists():
            return JsonResponse({'message': 'New email already in use.'}, status=409)

        user = request.user
        user.email = new_email
        user.save()

        return JsonResponse({'message': 'Email updated successfully.'}, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Error updating email: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
@login_required
def update_password(request):
    try:
        data = json.loads(request.body)
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')

        if not old_password or not new_password:
            return JsonResponse({'message': 'Old password and new password are required.'}, status=400)

        user = authenticate(request, username=request.user.email, password=old_password)
        if user is None:
            return JsonResponse({'message': 'Incorrect old password.'}, status=401)

        user.set_password(new_password)
        user.save()
        return JsonResponse({'message': 'Password updated successfully.'}, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Error updating password: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
@login_required
def update_name(request):
    try:
        data = json.loads(request.body)
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        new_email = data.get('newEmail')

        if not first_name or not last_name or not new_email:
            return JsonResponse({'message': 'First name, last name, and new email are required.'}, status=400)

        if User.objects.filter(email=new_email).exists() and new_email != request.user.email:
            return JsonResponse({'message': 'New email already in use.'}, status=409)

        user = request.user
        user.first_name = first_name
        user.last_name = last_name
        user.email = new_email
        user.save()

        return JsonResponse({'message': 'Name and email updated successfully.'}, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Error updating name and email: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
@login_required
def delete_account(request):
    try:
        user = request.user
        user.delete()
        return JsonResponse({'message': 'User deleted successfully.'}, status=200)
    except Exception as e:
        logging.exception(f"Error deleting user: {str(e)}")
        return JsonResponse({'message': f'Error deleting user: {str(e)}'}, status=500)

# Review-related views...


@csrf_exempt
@require_http_methods(["PUT"])
def update_name(request):
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return JsonResponse({'message': 'Authorization header is required.'}, status=400)
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        current_email = payload['email']

        data = json.loads(request.body)
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        new_email = data.get('newEmail')

        if not first_name or not last_name or not new_email:
            return JsonResponse({'message': 'First name, last name, and new email are required.'}, status=400)

        if User.objects.filter(email=new_email).exists() and new_email != current_email:
            return JsonResponse({'message': 'New email already in use.'}, status=409)

        user = User.objects.get(email=current_email)
        user.first_name = first_name
        user.last_name = last_name
        user.email = new_email
        user.save()

        return JsonResponse({'message': 'Name and email updated successfully.'}, status=200)
    except jwt.ExpiredSignatureError:
        return JsonResponse({'message': 'Token has expired.'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'message': 'Invalid token.'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'message': f'Error updating name and email: {str(e)}'}, status=500)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def old_delete_account(request):
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header is None:
            return JsonResponse({'message': 'Authorization header missing.'}, status=401)

        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = payload['email']

        user = User.objects.get(email=email)
        user.delete()

        return JsonResponse({'message': 'User deleted successfully.'}, status=200)
    except jwt.ExpiredSignatureError:
        return JsonResponse({'message': 'Token has expired.'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'message': 'Invalid token.'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found.'}, status=404)
    except Exception as e:
        logging.exception(f"Error deleting user: {str(e)}")
        return JsonResponse({'message': f'Error deleting user: {str(e)}'}, status=500)

# views.py in your Django app
from django.shortcuts import render

def index(request):
    return render(request, 'myapp/index.html')


def about(request):
    return render(request, 'about.html')

# Recipe routes

@csrf_exempt
@require_http_methods(["POST"])
def post_recipe(request):
    try:
        data = json.loads(request.body)
        name = data.get("name")
        description = data.get("description")
        imageurl = data.get("imageurl")
        category = data.get("category")
        ingredients = data.get("ingredients")
        instructions = data.get("instructions")

        if not name or not description or not imageurl or not category or not ingredients or not instructions:
            return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

        new_recipe = Recipe(
            name=name,
            description=description,
            imageurl=imageurl,
            category=category,
            ingredients="\n".join(ingredients),
            instructions="\n".join(instructions)
            
        )
        new_recipe.save()
        return JsonResponse({'status': 'success', 'recipeid': new_recipe.id}, status=201)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def recipes(request):
    all_recipes = Recipe.objects.all()
    return render(request, 'recipes.html', {'recipes': all_recipes})


## Get an instance of a logger
logger = logging.getLogger(__name__)



@csrf_exempt
@require_http_methods(["DELETE"])
def delete_recipe(request, id):
    try:
        recipe = Recipe.objects.get(id=id)
        recipe.delete()
        return JsonResponse({'status': 'success'})
    except Recipe.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Recipe not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)



@login_required    
def new_recipe(request):
    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        imageurl = request.POST.get("imageurl")
        category = request.POST.get("category")
        ingredients = request.POST.get("ingredients")
        instructions = request.POST.get("instructions")
        
        new_recipe = Recipe(
            name=name,
            description=description,
            imageurl=imageurl,
            category=category,
            ingredients=ingredients,
            instructions=instructions
        )
        new_recipe.save()
        
        return HttpResponseRedirect(
            f'{reverse("thankyou_add")}?name={name}&description={description}&imageurl={imageurl}&category={category}&ingredients={ingredients}&instructions={instructions}'
        )
    else:
        return render(request, 'new_recipe.html')  # Render the form for GET requests


@csrf_exempt
def remove_recipe(request):
    if request.method == "POST":
        # Correctly get the list of recipe IDs from the POST data
        recipeids = request.POST.getlist('recipe_ids')
        
        if recipeids:
            # Convert the recipe IDs to integers
            recipeids = [int(id) for id in recipeids]
            
            # Filter recipes using the list of IDs
            deleted_recipes = Recipe.objects.filter(id__in=recipeids)
            
            if deleted_recipes.exists():
                recipe_names = ', '.join([recipe.name for recipe in deleted_recipes])
                recipe_descriptions = ', '.join([recipe.description for recipe in deleted_recipes])
                recipe_categories = ', '.join([recipe.category for recipe in deleted_recipes])
                recipe_imageurls = ', '.join([recipe.imageurl for recipe in deleted_recipes])
                recipe_ingredients = ' | '.join([recipe.ingredients for recipe in deleted_recipes])
                recipe_instructions = ' | '.join([recipe.instructions for recipe in deleted_recipes])
                
                # Delete recipes after collecting details
                deleted_recipes.delete()
                
                # Prepare query parameters
                query_params = urlencode({
                    'name': recipe_names,
                    'description': recipe_descriptions,
                    'category': recipe_categories,
                    'imageurl': recipe_imageurls,
                    'ingredients': recipe_ingredients,
                    'instructions': recipe_instructions
                })
                
                return redirect(f'/thankyou/?{query_params}')
    
    recipes = Recipe.objects.all()
    return render(request, 'remove_recipe.html', {'recipes': recipes})

def thankyou(request):
    # Retrieve query parameters from the request
    name = request.GET.get("name", "Unknown")
    description = request.GET.get("description", "Unknown")
    category = request.GET.get("category", "Unknown")
    imageurl = request.GET.get("imageurl", "Unknown")
    ingredients = request.GET.get("ingredients", "Unknown")
    instructions = request.GET.get("instructions", "Unknown")

    # Pass the parameters to the template context
    context = {
        'name': name,
        'description': description,
        'category': category,
        'imageurl': imageurl,
        'ingredients': ingredients,
        'instructions': instructions
    }
    
    # Render the thankyou template with the provided context
    return render(request, 'thankyou.html', context)

# Add other view functions here
@csrf_exempt
@require_http_methods(["GET"])
def get_all_recipes(request):
    try:
        recipes = Recipe.objects.all()
        recipes_list = [
            {
                'id': recipe.id,
                'name': recipe.name,
                'description': recipe.description,
                'imageurl': recipe.imageurl,
                'category': recipe.category,
                'ingredients': recipe.ingredients.split('\n'),
                'instructions': recipe.instructions.split('\n')
            } for recipe in recipes
        ]
        return JsonResponse({'recipes': recipes_list}, status=200)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    

    
from django.shortcuts import get_list_or_404
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .models import Recipe

from django.shortcuts import get_list_or_404, render
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .models import Recipe

@csrf_exempt
@login_required
@require_http_methods(["GET"])
def get_recipe(request, recipe_id=None):
    # Initialize query parameters
    query_params = {}

    # Retrieve parameters from GET request
    if recipe_id is None:
        recipe_id = request.GET.get('id')
    name = request.GET.get('name')
    description = request.GET.get('description')
    imageurl = request.GET.get('imageurl')
    category = request.GET.get('category')
    ingredients = request.GET.get('ingredients')
    instructions = request.GET.get('instructions')

    # Try to convert recipe_id to integer if it's provided
    if recipe_id is not None:
        try:
            recipe_id = int(recipe_id)
            query_params['id'] = recipe_id
        except ValueError:
            raise Http404("Invalid recipe ID")
    
    # Add other query parameters
    if name is not None:
        query_params['name__iexact'] = name
    if description is not None:
        query_params['description__icontains'] = description
    if imageurl is not None:
        query_params['imageurl__icontains'] = imageurl
    if category is not None:
        query_params['category__iexact'] = category
    if ingredients is not None:
        query_params['ingredients__icontains'] = ingredients
    if instructions is not None:
        query_params['instructions__icontains'] = instructions

    # Retrieve recipes by any or all parameters
    if query_params:
        recipes = get_list_or_404(Recipe, **query_params)
    else:
        raise Http404("No valid query parameter provided")

    recipes_list = [{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'imageurl': recipe.imageurl,
        'category': recipe.category,
        'ingredients': recipe.ingredients.split('\n'),
        'instructions': recipe.instructions.split('\n')
    } for recipe in recipes]

    return JsonResponse(recipes_list, safe=False, status=200)


# views.pyfrom django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
import logging

logger = logging.getLogger(__name__)

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_POST
def add_recipe(request):
    try:
        data = json.loads(request.body)

        # Validate the incoming data
        required_fields = ['name', 'description', 'imageurl', 'category', 'ingredients', 'instructions']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing field: {field}'}, status=400)

        recipe = Recipe(
            name=data['name'],
            description=data['description'],
            imageurl=data['imageurl'],
            category=data['category'],
            ingredients=data['ingredients'],
            instructions=data['instructions']
        )
        recipe.save()
        return JsonResponse({'message': 'Recipe created successfully'}, status=201)
    except json.JSONDecodeError:
        logger.error("Invalid JSON format")
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        logger.error(f"Error creating recipe: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)


from django.shortcuts import render
from django.http import JsonResponse
from .models import Recipe

def get_all_recipes(request):
    recipes = list(Recipe.objects.all().values(
        'id', 'name', 'description', 'imageurl', 'category', 'ingredients', 'instructions'
    ))
    return JsonResponse(recipes, safe=False)


# View for Shop Items
from django.http import JsonResponse
from .models import ShopItem

def get_shop_items(request):
    shop_items = list(ShopItem.objects.all().values('id','name', 'description', 'price', 'quantity', 'image'))
    return JsonResponse(shop_items, safe=False)

# View for Reviews
from django.http import JsonResponse
from .models import Review

def get_all_reviews(request):
    reviews = list(Review.objects.all().values('id''user', 'comment', 'liked'))
    return JsonResponse(reviews, safe=False)



def thankyou_add(request):
    name = request.GET.get("name", "Unknown")
    description = request.GET.get("description", "Unknown")
    imageurl = request.GET.get("imageurl", "Unknown")
    category = request.GET.get("category", "Unknown")
    ingredients = request.GET.get("ingredients", "Unknown")
    instructions = request.GET.get("instructions", "Unknown")
    
    return render(request, 'thankyou_add.html', {
        'name': name,
        'description': description,
        'imageurl': imageurl,
        'category': category,
        'ingredients': ingredients,
        'instructions': instructions
    })





def recipes(request):
    all_recipes = Recipe.objects.all()
    return render(request, 'recipes.html', {'recipes': all_recipes})

@login_required
def old_profile_settings(request):
    if request.method == 'POST':
        profile_form = ProfileUpdateForm(request.POST, instance=request.user)
        password_form = PasswordChangeFormCustom(request.user, request.POST)
        delete_form = DeleteAccountForm(request.POST)

        if profile_form.is_valid():
            profile_form.save()
            return redirect('profile_settings')

        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Update session for new password
            return redirect('profile_settings')

        if delete_form.is_valid():
            user = request.user
            user.delete()  # Account deletion logic
            return redirect('logout')

    else:
        profile_form = ProfileUpdateForm(instance=request.user)
        password_form = PasswordChangeFormCustom(request.user)
        delete_form = DeleteAccountForm()

    context = {
        'profile_form': profile_form,
        'password_form': password_form,
        'delete_form': delete_form,
    }
    return render(request, 'profile_settings.html', context)

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import ProfileUpdateForm

from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from .forms import ProfileUpdateForm, PasswordChangeFormCustom, DeleteAccountForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import ProfileUpdateForm, PasswordChangeFormCustom, DeleteAccountForm

@login_required
def profile_settings(request):
    if request.method == 'POST':
        profile_form = ProfileUpdateForm(request.POST, instance=request.user)
        password_form = PasswordChangeFormCustom(request.user, request.POST)
        delete_form = DeleteAccountForm(request.POST)

        if profile_form.is_valid():
            profile_form.save()
            return redirect('profile_settings')

        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Update session for new password
            return redirect('profile_settings')

        if delete_form.is_valid():
            user = request.user
            user.delete()  # Account deletion logic
            return redirect('index')  # Redirect to index after deletion

    else:
        profile_form = ProfileUpdateForm(instance=request.user)
        password_form = PasswordChangeFormCustom(request.user)
        delete_form = DeleteAccountForm()

    context = {
        'profile_form': profile_form,
        'password_form': password_form,
        'delete_form': delete_form,
        'user': request.user,  # Pass the user object to the template
    }
    return render(request, 'profile_settings.html', context)





@login_required
def get_user_info(request):
    user = request.user
    user_info = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'last_login': user.last_login.isoformat() if user.last_login else None,
    }
    return JsonResponse(user_info)



def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'recipe_detail.html', {'recipe': recipe})



# views.py
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["PUT"])
def edit_recipe(request, id):
    try:
        recipe = get_object_or_404(Recipe, id=id)

        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        logger.debug(f"Updating recipe ID {id} with data: {data}")

        recipe.name = data.get('name', recipe.name)
        recipe.description = data.get('description', recipe.description)
        recipe.category = data.get('category', recipe.category)
        recipe.ingredients = data.get('ingredients', recipe.ingredients)
        recipe.instructions = data.get('instructions', recipe.instructions)
        recipe.imageurl = data.get('imageurl', recipe.imageurl)

        recipe.save()

        return JsonResponse({'status': 'success', 'recipe': recipe.to_dict()})
    except Recipe.DoesNotExist:
        logger.error(f"Recipe with ID {id} not found.")
        return JsonResponse({'status': 'error', 'message': 'Recipe not found'}, status=404)
    except Exception as e:
        logger.exception(f"Error updating recipe ID {id}: {e}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)





@csrf_exempt
def update_recipe(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Required to identify the recipe
            recipe_id = data.get("id")
            if not recipe_id:
                return JsonResponse({'status': 'error', 'message': 'Recipe ID is required'}, status=400)
            
            # Retrieve the recipe to be updated
            try:
                recipe = Recipe.objects.get(id=recipe_id)
            except ObjectDoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Recipe not found'}, status=404)
            except MultipleObjectsReturned:
                return JsonResponse({'status': 'error', 'message': 'Multiple recipes found with the same ID'}, status=400)
            
            # Check if any fields to update are provided
            fields_to_update = ['name', 'description', 'imageurl', 'category', 'ingredients', 'instructions']
            update_data = {field: data[field] for field in fields_to_update if field in data}

            if not update_data:
                return JsonResponse({'status': 'error', 'message': 'No fields provided to update'}, status=400)

            # Update the recipe fields
            for field, value in update_data.items():
                setattr(recipe, field, value)
            
            # Save the updated recipe
            recipe.save()
            
            return JsonResponse({'status': 'success', 'message': 'Recipe updated successfully'})
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)




class ShopItemList(APIView):
    def get(self, request):
        items = ShopItem.objects.all()
        serializer = ShopItemSerializer(items, many=True)
        return Response({'items': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ShopItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'item_id': serializer.instance.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShopItemDetail(APIView):
    def get_object(self, id):
        try:
            return ShopItem.objects.get(id=id)
        except ShopItem.DoesNotExist:
            raise Http404

    def get(self, request, id):
        item = self.get_object(id)
        serializer = ShopItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, id):
        item = self.get_object(id)
        serializer = ShopItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'Item updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        item = self.get_object(id)
        item.delete()
        return Response({'status': 'success', 'message': 'Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ShopItemSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def post_shop_item(request):
    serializer = ShopItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'item_id': serializer.instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def update_shop_item(request):
    if request.method == "POST":
        try:
            data = request.data
            item_id = data.get("id")
            if not item_id:
                return Response({'status': 'error', 'message': 'Item ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                item = ShopItem.objects.get(id=item_id)
            except ShopItem.DoesNotExist:
                return Response({'status': 'error', 'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ShopItemSerializer(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'status': 'success', 'message': 'Item updated successfully'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'status': 'error', 'message': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_shop_items(request):
    items = ShopItem.objects.all()
    serializer = ShopItemSerializer(items, many=True)
    return Response({'items': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_shop_item(request, id=None):
    query_params = {}
    if id is None:
        id = request.GET.get('id')
    name = request.GET.get('name')
    description = request.GET.get('description')
    price = request.GET.get('price')
    quantity = request.GET.get('quantity')
    image = request.GET.get('image')

    if id is not None:
        try:
            id = int(id)
            query_params['id'] = id
        except ValueError:
            raise Http404("Invalid item ID")
    
    if name is not None:
        query_params['name__iexact'] = name
    if description is not None:
        query_params['description__icontains'] = description
    if price is not None:
        query_params['price'] = price
    if quantity is not None:
        query_params['quantity'] = quantity
    if image is not None:
        query_params['image__iexact'] = image

    if query_params:
        items = ShopItem.objects.filter(**query_params)
        if not items.exists():
            raise Http404("No items found with the given parameters")
    else:
        raise Http404("No valid query parameter provided")

    serializer = ShopItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE'])
def delete_shop_item(request):
    if request.method in ["DELETE", "POST"]:
        try:
            data = request.data

            id = data.get("id")
            name = data.get("name")
            description = data.get("description")
            price = data.get("price")
            quantity = data.get("quantity")
            image = data.get("image")

            filter_criteria = {}
            if id is not None:
                filter_criteria['id'] = id
            if name is not None:
                filter_criteria['name__iexact'] = name
            if description is not None:
                filter_criteria['description__icontains'] = description
            if price is not None:
                filter_criteria['price'] = price
            if quantity is not None:
                filter_criteria['quantity'] = quantity
            if image is not None:
                filter_criteria['image__iexact'] = image

            if not filter_criteria:
                return Response({'status': 'error', 'message': 'No valid parameter provided'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                item = ShopItem.objects.get(**filter_criteria)
            except ShopItem.DoesNotExist:
                return Response({'status': 'error', 'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
            except ShopItem.MultipleObjectsReturned:
                return Response({'status': 'error', 'message': 'Multiple items found. Provide more specific criteria.'}, status=status.HTTP_400_BAD_REQUEST)

            item.delete()
            return Response({'status': 'success', 'message': 'Item deleted successfully'})

        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'status': 'error', 'message': 'Invalid request method'}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Review
from .serializers import ReviewSerializer

class ReviewList(APIView):
    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response({'reviews': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'review_id': serializer.instance.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetail(APIView):
    def get_object(self, id):
        try:
            return Review.objects.get(id=id)
        except Review.DoesNotExist:
            raise Http404

    def get(self, request, id):
        review = self.get_object(id)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    def put(self, request, id):
        review = self.get_object(id)
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'Review updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        review = self.get_object(id)
        review.delete()
        return Response({'status': 'success', 'message': 'Review deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'review_id': serializer.instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_review(request):
    try:
        data = request.data
        review_id = data.get("id")
        if not review_id:
            return Response({'status': 'error', 'message': 'Review ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({'status': 'error', 'message': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'Review updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_reviews(request):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response({'reviews': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_review(request, id=None):
    query_params = {}
    if id is None:
        id = request.GET.get('id')
    user_id = request.GET.get('user_id')
    username = request.GET.get('username')
    comment = request.GET.get('comment')
    liked = request.GET.get('liked')

    if id is not None:
        try:
            id = int(id)
            query_params['id'] = id
        except ValueError:
            raise Http404("Invalid review ID")

    if user_id is not None:
        query_params['user_id'] = user_id
    if username is not None:
        query_params['username__iexact'] = username
    if comment is not None:
        query_params['comment__icontains'] = comment
    if liked is not None:
        query_params['liked'] = liked.lower() == 'true'

    if query_params:
        reviews = Review.objects.filter(**query_params)
        if not reviews.exists():
            raise Http404("No reviews found with the given parameters")
    else:
        raise Http404("No valid query parameter provided")

    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE'])
def delete_review(request):
    try:
        data = request.data

        id = data.get("id")
        user_id = data.get("user_id")
        username = data.get("username")
        comment = data.get("comment")
        liked = data.get("liked")

        filter_criteria = {}
        if id is not None:
            filter_criteria['id'] = id
        if user_id is not None:
            filter_criteria['user_id'] = user_id
        if username is not None:
            filter_criteria['username__iexact'] = username
        if comment is not None:
            filter_criteria['comment__icontains'] = comment
        if liked is not None:
            filter_criteria['liked'] = liked.lower() == 'true'

        if not filter_criteria:
            return Response({'status': 'error', 'message': 'No valid parameter provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            review = Review.objects.get(**filter_criteria)
        except Review.DoesNotExist:
            return Response({'status': 'error', 'message': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        except Review.MultipleObjectsReturned:
            return Response({'status': 'error', 'message': 'Multiple reviews found. Provide more specific criteria.'}, status=status.HTTP_400_BAD_REQUEST)

        review.delete()
        return Response({'status': 'success', 'message': 'Review deleted successfully'})

    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from rest_framework import generics, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)

    

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=400)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Account does not exist.'}, status=400)
    
    user = authenticate(email=email, password=password)
    if user:
        user.last_login = timezone.now()
        user.save()
        auth_login(request, user)  # Log the user in
        logger.debug(f"User {user.email} last_login updated to {user.last_login}")
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid password.'}, status=400)





@login_required
def get_imageurl(request):
    user = request.user
    imageurl = user.profile.imageurl

    # Validate the imageurl or handle text data
    if imageurl:
        parsed_url = urlparse(imageurl)
        if not parsed_url.scheme or not parsed_url.netloc:
            # Handle invalid URL, consider it as text data
            return JsonResponse({'imageurl': imageurl, 'type': 'text'})
        else:
            return JsonResponse({'imageurl': imageurl, 'type': 'url'})
    else:
        return JsonResponse({'imageurl': None, 'type': 'none'})


from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import ProfileUpdateForm, PasswordChangeFormCustom, DeleteAccountForm
import logging

logger = logging.getLogger(__name__)

@login_required
def profile_settings(request):
    logger.debug(f"Current user: {request.user.email}, last login: {request.user.last_login}")
    
    if request.method == 'POST':
        profile_form = ProfileUpdateForm(request.POST, instance=request.user)
        password_form = PasswordChangeFormCustom(request.user, request.POST)
        delete_form = DeleteAccountForm(request.POST)

        if profile_form.is_valid():
            profile_form.save()
            return redirect('profile_settings')

        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Update session for new password
            return redirect('profile_settings')

        if delete_form.is_valid():
            user = request.user
            user.delete()  # Account deletion logic
            return redirect('index')  # Redirect to index after deletion

    else:
        profile_form = ProfileUpdateForm(instance=request.user)
        password_form = PasswordChangeFormCustom(request.user)
        delete_form = DeleteAccountForm()

    context = {
        'profile_form': profile_form,
        'password_form': password_form,
        'delete_form': delete_form,
        'user': request.user,  # Pass the user object to the template
    }
    return render(request, 'profile_settings.html', context)

from django.contrib.auth import authenticate, login as auth_login
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view
import logging

logger = logging.getLogger(__name__)

from django.contrib.auth import authenticate, login as auth_login
from django.utils import timezone
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)


from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST


from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login as auth_login
import logging
from .models import User

logger = logging.getLogger(__name__)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials.'}, status=HTTP_400_BAD_REQUEST)

    if not user.check_password(password):
        return Response({'error': 'Invalid credentials.'}, status=HTTP_400_BAD_REQUEST)

    auth_login(request, user)  # Log the user in with Django's login function
    user.last_login = timezone.now()
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })




# views.py
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.contrib.auth import update_session_auth_hash
from .forms import ChangeFirstNameForm, ChangeLastNameForm, ChangeEmailForm, PasswordChangeFormCustom

@login_required
def change_first_name(request):
    if request.method == 'POST':
        form = ChangeFirstNameForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'First name updated successfully.')
        else:
            messages.error(request, 'Failed to update first name. Please correct the errors below.')
    return redirect('profile_settings')

@login_required
def change_last_name(request):
    if request.method == 'POST':
        form = ChangeLastNameForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Last name updated successfully.')
        else:
            messages.error(request, 'Failed to update last name. Please correct the errors below.')
    return redirect('profile_settings')

@login_required
def change_email(request):
    if request.method == 'POST':
        form = ChangeEmailForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            request.user.email = email
            request.user.save()
            messages.success(request, 'Email updated successfully.')
        else:
            if form.errors.get('email'):
                messages.error(request, form.errors['email'][0])
            else:
                messages.error(request, 'Failed to update email. Please correct the errors below.')
    return redirect('profile_settings')


@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeFormCustom(user=request.user, data=request.POST)
        if form.is_valid():
            new_password = form.cleaned_data['new_password']
            request.user.set_password(new_password)
            request.user.save()
            update_session_auth_hash(request, request.user)
            messages.success(request, 'Password changed successfully.')
        else:
            for field in form.errors:
                for error in form.errors[field]:
                    messages.error(request, error)
    return redirect('profile_settings')
