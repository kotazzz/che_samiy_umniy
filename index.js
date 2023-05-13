import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { render } from "preact";
import { Component } from "preact/compat";

const States = {
  START: "start",
  MENU: "menu",
  QUESTION: "question",
  RESULTS: "results",
};

class Button extends Component {
  render() {
    let className =
      "btn btn-" + (this.props.variant ? this.props.variant : "primary");

    return (
      <button className={className} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

class MainContainer extends Component {
  render() {
    return <div className="container py-5">{this.props.children}</div>;
  }
}

class Title extends Component {
  render() {
    return <h1 className="display-4">{this.props.children}</h1>;
  }
}

class Header extends Component {
  render() {
    return <h1>{this.props.children}</h1>;
  }
}

class Center extends Component {
  render() {
    return <div className="text-center">{this.props.children}</div>;
  }
}

class Row extends Component {
  render() {
    return <div className="row py-2">{this.props.children}</div>;
  }
}

class Col extends Component {
  render() {
    return <div className="col">{this.props.children}</div>;
  }
}

class Text extends Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}

class StyledText extends Component {
  render() {
    let text = this.props.children;
    if (this.props.bold) text = <b>{text}</b>;
    if (this.props.italic) text = <i>{text}</i>;
    if (this.props.underline) text = <u>{text}</u>;
    if (this.props.kb) text = <kbd>{text}</kbd>;
    if (this.props.samp) text = <samp>{text}</samp>;
    if (this.props.code) text = <code>{text}</code>;
    if (this.props.link) text = <a href={this.props.link}>{text}</a>;
    if (this.props.highlight) text = <span className="highlight">{text}</span>;
    if (this.props.color)
      text = <span style={{ color: this.props.color }}>{text}</span>;
    if (this.props.size)
      text = <span style={{ fontSize: this.props.size }}>{text}</span>;
    if (this.props.initialism)
      text = <abbr title={this.props.initialism}>{text}</abbr>;
    if (this.props.attribute)
      text = <abbr title={this.props.attribute}>{text}</abbr>;
    if (this.props.align) {
      switch (this.props.align) {
        case "left":
          text = <div className="text-left">{text}</div>;
          break;
        case "center":
          text = <div className="text-center">{text}</div>;
          break;
        case "right":
          text = <div className="text-right">{text}</div>;
          break;
      }
    }
    return text;
  }
}

class Input extends Component {
  onEnter(e) {
    if (e.keyCode === 13) {
      this.props.onEnter(e);
    }
  }

  render() {
    return <input type="text" className="form-control" />;
  }
}

class Card extends Component {
  render() {
    if (this.props.children[0].type == Header) {
      let header = this.props.children[0];
      let body = this.props.children.slice(1);
      return (
        <div className="card">
          <div className="card-header">{header.props.children}</div>
          <div className="card-body">{body}</div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-body">{this.props.children}</div>
      </div>
    );
  }
}
class ButtonGroup extends Component {
  render() {
    return (
      <div className="btn-group" role="group" aria-label="Basic example">
        {this.props.children}
      </div>
    );
  }
}
class TextArea extends Component {
  render() {
    return (
      <textarea
        className="form-control"
        id={this.props.id}
        cols={this.props.cols}
        rows={this.props.rows}
      ></textarea>
    );
  }
}
class Spaced extends Component {
  render() {
    return <div className="py-2">{this.props.children}</div>;
  }
}
class Team {
  constructor(name, color = "red") {
    this.name = name;
    this.score = 0;
    this.color = color;
  }
  addScore(score) {
    this.score += score;
  }
}

class App extends Component {
  state = {
    current_state: States.START,
    questions: [],
    teams: [
      new Team("Команда один", "red"),
      new Team("Команда два", "blue"),
      new Team("Команда три", "green"),
    ],
  };

  constructor(props) {
    super(props);
    this.handlerState = this.handlerState.bind(this);
  }

  handlerState(state) {
    this.setState(state);
  }
  startPage(props) {
    return (
      <MainContainer>
        <Center>
          <Title>Что, самый умный?</Title>
        </Center>
        <Card>
          <Row>
            <Center>
              <Header> Добро пожаловать</Header>
              <Text>
                на главную страницу менеджера викторин{" "}
                <StyledText highlight>"Что, самый умный?"</StyledText>
              </Text>
              <ButtonGroup>
                <Button
                  variant="success"
                  onClick={this.handlerState({ current_state: States.MENU })}
                >
                  Начать
                </Button>

                <Button>Тут что то будет...</Button>
              </ButtonGroup>
            </Center>
          </Row>
          <Row>
            <Col>
              <Spaced>
                <Card>
                  <Header>Текущие команды</Header>
                  <Text>Всего команд: {this.state.teams.length}</Text>
                  Команды:
                  <ul>
                    {this.state.teams.map((team) => (
                      <li>
                        <StyledText color={team.color}>
                          {team.name}
                        </StyledText>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Spaced>
              <Card>
                <Header>Текущие вопросы</Header>
                <Text>Всего вопросов: {this.state.questions.length}</Text>
              </Card>
            </Col>
            <Col>
              <Spaced>
                <Card>
                  <Header>Установить вопросы</Header>
                  <Text>
                    Статус:{" "}
                    <StyledText code>
                      <span id="log"></span>
                    </StyledText>
                  </Text>
                  <Spaced>
                    <TextArea id="load-data" cols="60" rows="10"></TextArea>
                  </Spaced>
                  <Button
                    variant="warning"
                    onClick={() => {
                      try {
                        let questions = JSON.parse(
                          document.getElementById("load-data").value
                        );
                        this.handlerState({
                          questions: questions,
                        });
                        document.getElementById("log").innerHTML =
                          "Вопросы загружены";
                      } catch (e) {
                        document.getElementById("log").innerHTML = e.message;
                      }
                    }}
                  >
                    Загрузить
                  </Button>
                </Card>
              </Spaced>
            </Col>
          </Row>
        </Card>
      </MainContainer>
    );
  }
  menuPage(props) {
    return (
      <MainContainer>
        <Center>
          <Title>Что, самый умный?</Title>
        </Center>

        <Card>
          <Header>Выберите вопрос</Header>
          <Button
            onClick={this.handlerState({ current_state: States.START })}
          >
            Главная
          </Button>
        </Card>
      </MainContainer>
    );
  }
  unknownPage(props) {
    return (
      <MainContainer>
        <Center>
          <Title>Что, самый умный?</Title>
        </Center>
        <Card>
          <Header>Выберите вопрос</Header>
        </Card>
      </MainContainer>
    );
  }
  render() {
    return this.startPage(this.state);
    if (this.state.current_state == States.START) {
      return this.startPage(this.state);
    } else if (this.state.current_state == States.MENU) {
     return this.menuPage(this.state);
    } else {
      return this.unknownPage(this.state);
    }
  }
}

render(<App />, document.body);
