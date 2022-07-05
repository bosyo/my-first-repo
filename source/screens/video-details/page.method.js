import React from 'react'
import userAPI from '@api/user/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {AsyncStorage} from 'react-native';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        analyticsMode: 'views',
        monthSelectorModal: false,
        month: moment()
      }
    }

    componentDidMount() {
      // Orientation.lockToPortrait();
    };
    componentWillReceiveProps(np) {
      const {analyticsState} = np;
      if (analyticsState && analyticsState.type) {
        this.setState({
          analyticsMode: analyticsState.type
        });
      }
    }
    // Event handlers
    _onPressAnalyticsButton = (mode) => {
      this._selectAnalyticsMode(mode);
    };
    _onPressCalendar = () => {
      this._toggleMonthSelectorModal(true);
    };
    _onMonthTapped = (date) => {
      this._setMonth(date);
      this._toggleMonthSelectorModal(false);
      this.props.setAnalyticMonth(date.toDate());
    };
    // Helpers
    _selectAnalyticsMode = (mode) => {
      this.props.setAnalyticType(mode);
    };
    _navigateToVideoDirectory = (videoId) => {
      this.props.history.push('/video-tagging', {videoId});
    };
    _setMonth = (date) => {
      this.setState({
        month: date
      })
    };
    _toggleMonthSelectorModal = (bool) => {
      this.setState({
        monthSelectorModal: bool
      })
    }
    _onPressGoBack = () => {
      this.props.history.goBack();
    };
    // API
  }
}

export default MethodMixin;
