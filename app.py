from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/xo')
def xo():
    return render_template('xo.html')

@app.route('/reci')
def reci():
    return render_template('reci.html')

@app.route('/kviz')
def kviz():
    return render_template('kviz.html')

@app.route('/skocko')
def skocko():
    return render_template('skocko.html')

if __name__ == '__main__':
    app.run(debug=True)