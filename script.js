const INSERT = 'INSERT';
const OPERATE = 'OPERATE';
const CALCULATE = 'CALCULATE';
const CANCEL = 'CANCEL';

const operators = ['/', '*', '+', '-'];

const insertNumber = (input) => ({
  type: INSERT,
  input: input
});

const insertOperator = (input) => ({
  type: OPERATE,
  input: input
});

const calculate = () => ({
  type: CALCULATE,
});

const cancel = () => ({
  type: CANCEL,
});

const initialState = {
  input: '',
  answer: '',
};

const calculatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSERT:
      let currentInput = state.input;
      if (currentInput === '0' && action.input === '0') {
        return { input: currentInput, answer: state.answer };
      }
      return {
        input: currentInput + action.input,
        answer: ''
      };

    case OPERATE:
      let elementValue = action.input;
      if (elementValue === 'X') {
        elementValue = '*';
      }
      let currentInputOp = state.input;
      const lastChar = currentInputOp.slice(-1);
      const secondLastChar = currentInputOp.slice(-2, -1);
      const stringHasDecimal = currentInputOp.includes('.');
      let isOperator = false;
      let lastCharOperator = false;
      operators.forEach((element) => {
        if (secondLastChar === element || lastChar === element) {
          isOperator = true;
        }
        if (elementValue === element) {
          lastCharOperator = true;
        }
      });

      if (lastCharOperator && (state.answer !== '')) {
        currentInputOp = state.answer;
      }

      if ((lastChar === '.' || stringHasDecimal) && elementValue === '.' && !isOperator) {
        return {
          input: currentInputOp,
          answer: state.answer
        }
      }

      const updatedInput = currentInputOp + elementValue;
      return {
        input: updatedInput,
        answer: ''
      };

    case CALCULATE:
      let input = state.input;
      let newInput = '';
      let isOperatorCalc = false;
      let valueReplaced = false;
      for (let i = 0; i < input.length; i++) {
        if (operators.includes(input[i])) {
          isOperatorCalc = true;
          if (i >= 1) {
            if (operators.includes(input[i - 1]) && input[i] !== '-') {
              newInput = newInput.replace(input[i - 1], input[i]);
              valueReplaced = true;
            }
            else if (operators.includes(input[i - 1]) && input[i] == '-' && operators.includes(input[i + 1])) {
              newInput = newInput.replace(input[i - 1], input[i]);
              valueReplaced = true;
            }
          }
          if (!valueReplaced) {
            newInput += input[i];
          }
        }
        else {
          isOperatorCalc = false;
          newInput += input[i];
        }
      }

      try {
        const evalData = eval(newInput);
        if (evalData === undefined || isNaN(evalData)) {
          throw new Error('Invalid input or operation');
        }
        return {
          input: input,
          answer: evalData.toString(),
        }
      } catch (error) {
        return {
          answer: 'Error',
        }
      }

    case CANCEL:
      return {
        input: '',
        answer: ''
      }

    default:
      return state;
  }
};

const store = Redux.createStore(calculatorReducer);

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleNormalBtn = this.handleNormalBtn.bind(this);
    this.handleEqualBtn = this.handleEqualBtn.bind(this);
    this.handleACBtn = this.handleACBtn.bind(this);
    this.handleOperatorBtn = this.handleOperatorBtn.bind(this);
  }

  handleNormalBtn(event) {
    this.props.insertNumberInput(event.target.innerHTML);
  }

  handleOperatorBtn(event) {
    this.props.insertOpertorInput(event.target.innerHTML);
  }

  handleEqualBtn() {
    this.props.calculateInput();
  }

  handleACBtn() {
    this.props.cancelInput();
  }

  render() {
    return (
      <div id="container" className="container-fluid d-flex flex-column justify-content-center align-items-center w-100 full-height border border-2 border-danger">
        <div id="calculator" className="border border-dark">
          <table className="calc-table">
            <tbody>
              <tr>
                <td colspan="4" className="display-cell p-1 border border-dark">
                  <div id="display" className="text-end">
                    {this.props.answer || <div>{this.props.input !== '' ? this.props.input + '\n' : '0\n'}</div>}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button id="clear" onClick={this.handleACBtn} className="w-100 cancel">AC</button>
                </td>
                <td>
                  <button id="divide" onClick={this.handleOperatorBtn}>/</button>
                </td>
                <td>
                  <button id="multiply" onClick={this.handleOperatorBtn}>X</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button id="seven" onClick={this.handleNormalBtn}>7</button>
                </td>
                <td>
                  <button id="eight" onClick={this.handleNormalBtn}>8</button>
                </td>
                <td>
                  <button id="nine" onClick={this.handleNormalBtn}>9</button>
                </td>
                <td>
                  <button id="subtract" onClick={this.handleOperatorBtn}>-</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button id="four" onClick={this.handleNormalBtn}>4</button>
                </td>
                <td>
                  <button id="five" onClick={this.handleNormalBtn}>5</button>
                </td>
                <td>
                  <button id="six" onClick={this.handleNormalBtn}>6</button>
                </td>
                <td>
                  <button id="add" onClick={this.handleOperatorBtn}>+</button>
                </td>
              </tr>
              <tr>
                <td>
                  <button id="one" onClick={this.handleNormalBtn}>1</button>
                </td>
                <td>
                  <button id="two" onClick={this.handleNormalBtn}>2</button>
                </td>
                <td>
                  <button id="three" onClick={this.handleNormalBtn}>3</button>
                </td>
                <td rowspan="2">
                  <button id="equals" onClick={this.handleEqualBtn}>=</button>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <button id="zero" onClick={this.handleNormalBtn} className="w-100">0</button>
                </td>
                <td>
                  <button id="decimal" onClick={this.handleOperatorBtn}>.</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  input: state.input,
  answer: state.answer
});

const mapDispatchToProps = (dispatch) => ({
  insertNumberInput: (newInput) => {
    dispatch(insertNumber(newInput));
  },
  insertOpertorInput: (newInput) => {
    dispatch(insertOperator(newInput))
  },
  calculateInput: () => {
    dispatch(calculate());
  },
  cancelInput: () => {
    dispatch(cancel());
  }
});

const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const Container = connect(mapStateToProps, mapDispatchToProps)(Calculator);

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')
);
