
import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Utils from '../util/Utils';
import { useSelector, useDispatch } from 'react-redux';
import reducer, { INIT_STATE } from "../../redux/user/Reducer";
import { USER_DATA, USER_KEY, USER_UPDATE } from '../../redux/Types';
import { updateUserData } from '../../redux/user/Action';

export default function UseReducer(props) {

    const stateee = useSelector(state => state)
    const dispatchh = useDispatch()
    const [state, dispatch] = useReducer(reducer, INIT_STATE);
    console.log('stateeeeeee', state[USER_KEY], stateee,);

    // dispatch({state[USER_KEY]:'sasasas'})


    console.log('stateeeeeee-----------', state, stateee,);

    // const cardData = state[CARD_ROOT][CARD_KEY][CARD_SUCCESS];
    // const paymentScreenCheckOut = state[SUBSCRIPTION_ROOT][SUBSCRIPTION_KEY][PAYMENT_SCREEN_CHECKOUT_FOCUS_STATUS];


    return (
        <TouchableOpacity
            onPress={() => {

                dispatch(updateUserData({
                    [USER_DATA]: 'sasasas',
                }))

                console.log('state[USER_KEY][USER_DATA]', state[USER_KEY][USER_DATA],);
            }
            }
        >
            <Text>UseReducer</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        justifyContent: 'center',

    },
    tabLabelText: {

    },

})