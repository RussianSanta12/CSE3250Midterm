from flask import Flask, render_template, request
import pyjokes


app = Flask(__name__)
history = []

@app.route('/', methods = ["GET", "POST"])
def joke():
    if request.method == "POST":
        joke_text = pyjokes.get_joke()
        history.append(joke_text)
        return render_template('oldIndex.html', joke=joke_text)
    return render_template('oldIndex.html', joke=None)



@app.route('/History', methods=["GET"])
def history_view():
    return render_template('oldhistory.html', history=history)



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
