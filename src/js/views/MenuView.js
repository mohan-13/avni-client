import {View, TouchableHighlight, Text, ProgressBarAndroid, StyleSheet, Animated, ScrollView} from 'react-native';
import React, {Component} from 'react';
import AbstractComponent from "../framework/view/AbstractComponent";
import Path from '../framework/routing/Path';
import {Content, Grid, Col, Row, Button, Icon} from "native-base";
import TypedTransition from "../framework/routing/TypedTransition";
import SettingsView from "./settings/SettingsView";
import SyncService from "../service/SyncService";
import EntityMetaData from '../models/EntityMetaData';
import {GlobalStyles} from './primitives/GlobalStyles';

@Path('/menuView')
class MenuView extends AbstractComponent {
    static styles = StyleSheet.create({
        icon: {color: '#009688', opacity: 0.8, fontSize: 48, justifyContent: 'center'},
        iconLabel: {fontSize: 20, color: '#fff', justifyContent: 'center'}
    });

    constructor(props, context) {
        super(props, context);
        this.state = {syncing: false, error: false};
    }

    settingsView() {
        TypedTransition.from(this).to(SettingsView);
    }

    _preSync() {
        this._animatedValue = new Animated.Value(0);
        Animated.timing(this._animatedValue, {
            toValue: 1000,
            duration: 20000
        }).start();
        this.setState({syncing: true, error: false});
    }

    _postSync() {
        setTimeout(() => this.setState({syncing: false, error: false}), 5000);
    }

    _onError(error) {
        this.setState({syncing: false, error: true});
    }

    sync() {
        const syncService = this.context.getService(SyncService);
        syncService.sync(EntityMetaData.model(), this._preSync.bind(this), this._postSync.bind(this), this._onError.bind(this));
    }

    renderSyncButton() {
        if (this.state.syncing) {
            const interpolatedRotateAnimation = this._animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['360deg', '0deg']
            });

            return (
                <Animated.View style={{transform: [{rotate: interpolatedRotateAnimation}]}}>
                    <Icon name='sync' style={MenuView.styles.icon}/>
                </Animated.View>);
        } else if (!this.state.syncing && this.state.error) {
            return (<Icon name='sync-problem' style={MenuView.styles.icon}/>);
        } else {
            return (<Icon name='sync' style={MenuView.styles.icon}/>);
        }
    }

    render() {
        return (
            <Content style={{backgroundColor: '#212121'}}>
                <Grid style={{marginHorizontal: 29, marginTop: 71}}>
                    <Row>
                        <Col style={{marginHorizontal: 29}}>
                            <Button transparent large onPress={this.sync.bind(this)} style={{justifyContent: 'center'}}>
                                {this.renderSyncButton()}
                            </Button>
                            <Text style={MenuView.styles.iconLabel}>Sync Data</Text>
                        </Col>
                        <Col style={{marginHorizontal: 29}}>
                            <Button onPress={() => this.settingsView()} transparent large>
                                <Icon name='settings' style={MenuView.styles.icon}/>
                            </Button>
                            <Text style={MenuView.styles.iconLabel}>Settings</Text>
                        </Col>
                        <Col style={{marginHorizontal: 29}}>
                        </Col>
                    </Row>
                    {/*{hack for the background color}*/}
                    <Row>
                        <Col><View style={{height: 800}}></View></Col>
                    </Row>
                </Grid>
            </Content>
        );
    }
}

export default MenuView;
