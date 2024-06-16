from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:dbpassword!@localhost/recipe_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Define a model for the Recipe
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    steps = db.Column(db.Text, nullable=False)

    def __init__(self, name, ingredients, steps):
        self.name = name
        self.ingredients = ingredients
        self.steps = steps

@app.route("/")
def index():
    recipes = Recipe.query.all()
    return render_template("index.html", recipes=recipes)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/recipes")
def recipes():
    all_recipes = Recipe.query.all()
    print("All Recipes:", all_recipes)  # Debug statement
    return render_template("recipes.html", recipes=all_recipes)

@app.route("/thankyou", methods=["GET", "POST"])
def thankyou():
    if request.method == "POST":
        recipe_name = request.form["recipe_name"]
        ingredients = request.form["ingredients"]
        steps = request.form["steps"]
    else:
        # This is just to allow GET requests for demonstration purposes
        recipe_name = request.args.get("recipe_name", "Unknown")
        ingredients = request.args.get("ingredients", "Unknown")
        steps = request.args.get("steps", "Unknown")

    return render_template("thankyou.html", recipe_name=recipe_name, ingredients=ingredients, steps=steps)

@app.route("/new_recipe")
def new_recipe():
    return render_template("new_recipe.html")

@app.route("/add_recipe", methods=["POST"])
def add_recipe():
    recipe_name = request.form["recipe_name"]
    ingredients = request.form["ingredients"]
    steps = request.form["steps"]
    new_recipe = Recipe(name=recipe_name, ingredients=ingredients, steps=steps)
    db.session.add(new_recipe)
    db.session.commit()
    return redirect(url_for("thankyou", recipe_name=recipe_name, ingredients=ingredients, steps=steps))

@app.route("/remove_recipe", methods=["GET", "POST"])
def remove_recipe():
    if request.method == "POST":
        recipe_ids = request.form.getlist("recipe_ids")
        for recipe_id in recipe_ids:
            recipe_to_delete = Recipe.query.get(recipe_id)
            db.session.delete(recipe_to_delete)
        db.session.commit()
        return redirect(url_for("recipes"))
    
    all_recipes = Recipe.query.all()
    return render_template("remove_recipe.html", recipes=all_recipes)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables for our models
    app.debug = True
    app.run()
