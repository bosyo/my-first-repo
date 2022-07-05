import React from 'react'

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    componentDidMount() {
      console.log("Home screen mounted")
    }
    // Event handlers
    _onPressLogin = () => {
      this.props.history.push('/');
    }
  }
}

export default MethodMixin;
