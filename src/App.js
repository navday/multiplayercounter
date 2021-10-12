import React, { Component, useEffect, useState} from 'react';

import Click from "./Click";
import API, { graphqlOperation } from '@aws-amplify/api'

import * as subscriptions from './graphql/subscriptions'
import * as mutations from './graphql/mutations'

import './App.css';
import 'rc-slider/assets/index.css';

import awsconfig from './aws-exports';

API.configure(awsconfig)

export default class App extends Component{
    render = () =>
        <div className="App">
                <Click name="default"/>
        </div>
}
