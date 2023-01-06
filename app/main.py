import time
from google.cloud import aiplatform
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/classify', methods=['POST'])
def classify():
    endpoint = aiplatform.Endpoint('projects/403196473957/locations/us-central1/endpoints/2125791383095607296')

    input_text = request.json.get('instances')[0].get('data')

    print(f"Input text: \n\t{input_text}\n")
    instance = [{
        "data": input_text
    }]

    start = time.time()
    prediction = endpoint.predict(instances=instance)
    end = time.time()
    print(f"Prediction response: \n\t{prediction}")
    print(f"Prediction time: {end-start} seconds")

    return prediction.predictions[0]



@app.route('/')
def root():
    return render_template('index.html')


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='0.0.0.0', port=8000, debug=True)
