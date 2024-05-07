import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import COLORS from '../../common/colors/colors';

import { connect } from 'react-redux';
import { SUPPORT_KEY, SUPPORT_TICKET_LISTING_SUCCESS, USER_KEY, USER_DATA, SUPPORT_TICKET_LISTING_LOADER } from '../../redux/Types';
import { updateSupportFormData, GetSupportTickets } from "../../redux/support/Action";
import { Header } from '../../common/base_components';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import moment from "moment";
import fontType from '../../../assets/fontName/FontName';

class TicketList extends Component {
    componentDidMount() {
        this.props.GetSupportTickets()
    }

    renderItems = (item) => {
        return (
            <View style={[styles.bottomShadow,]}>
                <View style={styles.innerView}>


                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={styles.number}>{item.item.ticket_number}</Text>
                        <Text style={[styles.number, { color: COLORS.pColor }]}>{item.item.status}</Text>

                    </View>
                    <Text style={styles.subject}>{item.item.subject}</Text>
                    <Text style={styles.createdAt}>{moment(item.item.created_at).format('YYYY-MM-DD')}</Text>
                    {/* </View> */}

                </View>

            </View>
        )
    }

    render() {
        let { supportListData, loading } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.White }}>
                <Header
                    bottomShadow={true}
                    back={true}
                    title={STRINGS.TicketStatus}
                    navigation={this.props.navigation}
                />
                {loading ?
                    <ActivityIndicator color={COLORS.pColor} /> :


                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ marginHorizontal: Utils.widthScaleSize(10), marginBottom: Utils.heightScaleSize(2) }}
                        data={supportListData}
                        // data={[]}
                        renderItem={this.renderItems}
                        keyExtractor={(item, index) => {
                            return index;
                        }}

                        ListEmptyComponent={() => {
                            return (
                                <View style={styles.emptyView}>
                                    <Text style={styles.text}>No Ticket is reaised yet.. </Text>
                                </View>
                            )
                        }}

                        ListFooterComponentStyle={{ height: Utils.heightScaleSize(40) }}
                    />}
            </View>
        )
    }
}


const mapStateToProps = ({ support, user }) => {
    const support_key = support && support[SUPPORT_KEY] ? support[SUPPORT_KEY] : {};
    const loading = support_key && support_key[SUPPORT_TICKET_LISTING_LOADER] ? support_key[SUPPORT_TICKET_LISTING_LOADER] : false;

    const supportListData = support_key && support_key[SUPPORT_TICKET_LISTING_SUCCESS] ? support_key[SUPPORT_TICKET_LISTING_SUCCESS] : [];


    // const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
    return ({
        support_key,
        loading,
        supportListData
        // user_data
    });
}

const mapDispatchToProps = {
    updateSupportFormData, GetSupportTickets
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketList);

const styles = StyleSheet.create({
    text: {
        fontFamily: fontType.jost_SemiBold_600,
        fontSize: Utils.scaleSize(15),
        color: COLORS.Black
    },

    emptyView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:'pink',
        marginTop: Utils.heightScaleSize(50)

    },
    bottomShadow: {
        borderWidth: 1,
        borderRadius: Utils.scaleSize(10),
        backgroundColor: COLORS.White,
        borderColor: COLORS.White,
        borderBottomWidth: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 3,
        marginVertical: Utils.heightScaleSize(10),
        marginHorizontal: Utils.widthScaleSize(4)
    },
    innerView: {
        marginVertical: Utils.heightScaleSize(20),
        marginHorizontal: Utils.widthScaleSize(15),
    },
    number: {
        fontFamily: fontType.jost_SemiBold_600,
        fontSize: Utils.scaleSize(15),
        color: COLORS.Black
    },
    subject: {
        fontFamily: fontType.jost_400,
        fontSize: Utils.scaleSize(14),
        color: COLORS.placeholderColor
    },
    createdAt: {
        alignSelf: 'flex-end',
        fontSize: Utils.scaleSize(14),
        // color:COLORS.placeholderColor
    }
});