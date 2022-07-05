import { StyleSheet } from 'react-native'
import {Colors} from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fb5f7c',
    alignItems: 'center',
  },
  recentSearchesContainer: {
    flex: 1,
    // marginTop: 115,
    backgroundColor: 'white'
  },
  recentSearchesItem : {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey
  }
})
