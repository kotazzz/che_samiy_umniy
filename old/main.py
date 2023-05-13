import http.server
import json
import shlex
from urllib.parse import unquote

__version__ = "0.1.0"


class Router:
    def __init__(self):
        self.routes = {}

    def route(self, path):
        def wrapper(handler):
            self.routes[path] = handler
            return handler

        return wrapper

    def handle(self, data, request: http.server.SimpleHTTPRequestHandler):
        path = request.path
        # strip path from ?
        path = path.split("?")[0]
        if path in self.routes:
            return self.routes[path](data, request)
        else:
            return {"error": "404"}


class Game:
    def __init__(self):
        self.commands = {}
        self.questions = []

    def set_commands(self, commands):
        self.commands = {name: {} for name in commands}


router = Router()
game = Game()


@router.route("/ping")
def handler_ping(data, request):
    return {"version": __version__}


@router.route("/set")
def handler_ping(data, request):
    count = data["command_count"]
    commands = data["command_names"]
    commands = [n if n else f"Команда {i}" for i, n in zip(range(1, 6), commands)]
    game.set_commands(commands[:count])
    return {"commands": commands[:count]}


@router.route("/info")
def handler_ping(data, request):
    return {"commands": list(game.commands.keys())}

@router.route("/questions")
def handler_ping(data, request):
    file = data['filename'] or 'q.txt'
    content = open(file, 'r').read()
    content = [shlex.split(line) for line in content.splitlines()]
    game.questions = content
    


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # CORS
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        try:
            el = self.path.split("?")
            data = el[1] if len(el) > 1 else ""
            data = unquote(data)
            data = json.loads(data)
            answer = router.handle(data, self)
            result = json.dumps(answer).encode("utf-8")
        except Exception as e:
            result = b'{"error": "500"}'
            self.wfile.write(result)
            raise e
        else:
            self.log_message(f"Answer: {result}")
            self.wfile.write(result)
            return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        return


if __name__ == "__main__":
    httpd = http.server.HTTPServer(("", 8000), Handler)
    httpd.serve_forever()
