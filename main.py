from flask import Flask, request, jsonify
from flask_cors import CORS
from pytube import YouTube
import os

app = Flask(__name__)
CORS(app)
@app.route('/video_info', methods=['POST'])
def get_video_info():
    resolutions = []
    url = request.json.get('url')
    yturl = url
    try:
        # Create a YouTube object from the URL
        yt = YouTube(url)

        # Extract video information
        thumbnail_url = yt.thumbnail_url
        video_title = yt.title

        # Get all available streams for the video
        video_streams = yt.streams.filter(file_extension="mp4")

        # Extract unique resolutions from the streams
        resolutions = list(set([stream.resolution for stream in video_streams]))

        return jsonify({
            "title": video_title,
            "thumbnail": thumbnail_url,
            "resolutions": resolutions
        })

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/download', methods=['POST'])
def download_video():
    try:
        data = request.get_json()
        url = data.get('url')
        resolution = data.get('resolution')

        # Print the values
        print("URL:", url)
        print("Resolution:", resolution)

        # ... rest of your code ...
        ytv = YouTube(url)
        video_stream = ytv.streams.filter(res=resolution).first()

        downloads = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Downloads')
        video_stream.download(output_path=downloads)

        return jsonify({"message": "Your Download has been started."})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)

