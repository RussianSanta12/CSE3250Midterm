from flask import Flask, render_template, request
import pyjokes


app = Flask(__name__)
history = []

@app.route('/', methods = ["GET", "POST"])
def joke():
    if request.method == "POST":
        joke_text = pyjokes.get_joke()
        history.append(joke_text)
        return render_template('Index.html', joke=joke_text)
    # GET request just shows the page without a joke yet
    return render_template('Index.html', joke=None)



@app.route('/History', methods=["GET"])
def history_view():
    # Render a simple page listing all jokes gathered so far
    return render_template('history.html', history=history)



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
