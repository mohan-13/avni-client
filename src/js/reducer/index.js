import IndividualRegisterActionMap, {IndividualRegisterActions} from "../action/individual/IndividualRegisterActions";
import Reducer from "./Reducer";
import IndividualProfileActionMap, {IndividualProfileActions} from "../action/individual/IndividualProfileActions";
import ProgramEnrolmentActionMap, {ProgramEnrolmentActions} from '../action/program/ProgramEnrolmentActions';
import IndividualGeneralHistoryActionsMap, {IndividualGeneralHistoryActions} from '../action/individual/IndividualGeneralHistoryActions';
import {
    EncounterActions,
    IndividualEncounterViewActionsMap
} from "../action/individual/EncounterActions";
import {
    DashboardActions,
    DashboardActionsMap
} from "../action/program/DashboardActions";
import {
    ProgramEnrolmentsActions,
    ProgramEnrolmentsActionsMap
} from "../action/program/ProgramEnrolmentsActions";
import {ProgramEnrolmentDashboardActions, ProgramEnrolmentDashboardActionsMap} from '../action/program/ProgramEnrolmentDashboardActions';
import {ProgramEncounterActions, ProgramEncounterActionsMap} from '../action/program/ProgramEncounterActions';
import {IndividualRegistrationDetailsActions, IndividualRegistrationDetailsActionsMap} from '../action/individual/IndividualRegistrationDetailsActions';
import {IndividualSearchActions, IndividualSearchActionsMap} from '../action/individual/IndividualSearchActions';
import {AddressLevelActions} from '../action/AddressLevelActions';
import _ from 'lodash';

export default class Reducers {
    static reducerKeys = {
        programEnrolment: "programEnrolment",
        individualGeneralHistory: "individualGeneralHistory",
        encounter: "encounter",
        individualRegister: "individualRegister",
        individualProfile: 'individualProfile',
        dashboard: 'dashboard',
        programEnrolments: 'programEnrolments',
        programEnrolmentDashboard: 'programEnrolmentDashboard',
        programEncounter: 'programEncounter',
        individualRegistrationDetails: 'individualRegistrationDetails',
        individualSearch: 'individualSearch',
        addressLevels: 'addressLevels'
    };
    
    static createReducers(beanStore) {
        const reducerMap = {};
        reducerMap[Reducers.reducerKeys.individualSearch] = Reducers._add(IndividualSearchActionsMap, IndividualSearchActions, beanStore);
        reducerMap[Reducers.reducerKeys.addressLevels] = Reducers._add(new Map([]), AddressLevelActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualRegister] = Reducers._add(IndividualRegisterActionMap, IndividualRegisterActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualProfile] = Reducers._add(IndividualProfileActionMap, IndividualProfileActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolment] = Reducers._add(ProgramEnrolmentActionMap, ProgramEnrolmentActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualGeneralHistory] = Reducers._add(IndividualGeneralHistoryActionsMap, IndividualGeneralHistoryActions, beanStore);
        reducerMap[Reducers.reducerKeys.encounter] = Reducers._add(IndividualEncounterViewActionsMap, EncounterActions, beanStore);
        reducerMap[Reducers.reducerKeys.dashboard] = Reducers._add(DashboardActionsMap, DashboardActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolments] = Reducers._add(ProgramEnrolmentsActionsMap, ProgramEnrolmentsActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEnrolmentDashboard] = Reducers._add(ProgramEnrolmentDashboardActionsMap, ProgramEnrolmentDashboardActions, beanStore);
        reducerMap[Reducers.reducerKeys.programEncounter] = Reducers._add(ProgramEncounterActionsMap, ProgramEncounterActions, beanStore);
        reducerMap[Reducers.reducerKeys.individualRegistrationDetails] = Reducers._add(IndividualRegistrationDetailsActionsMap, IndividualRegistrationDetailsActions, beanStore);

        return reducerMap;
    };

    static onError(state, action, context, error) {
        const newState = Object.assign({}, state);
        newState.error = error;
        return newState;
    }

    static _add(actions, actionClass, beanStore) {
        if (!actions.has('RESET'))
            actions.set('RESET', () => actionClass.getInitialState(beanStore));
        if (!actions.has('ON_ERROR'))
            actions.set('ON_ERROR', Reducers.onError);
        return Reducer.factory(actions, actionClass.getInitialState(beanStore), beanStore);
    };
}