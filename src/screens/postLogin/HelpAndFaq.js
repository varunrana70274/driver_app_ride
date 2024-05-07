import { Text, View, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { Header, WebViewScreen } from '../../common/base_components'
import STRINGS from '../../common/strings/strings'
import COLORS from '../../common/colors/colors'
import Utils from '../../common/util/Utils'
import fontType from '../../../assets/fontName/FontName'

const data = [
    { questions: "1. How do book a ride ?", answers: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto " },
    {}
]



export default class HelpAndFaq extends Component {

    renderItem = (item) => {
        // console.log('itemmm', item)
        return (
            // <PickDropValue item={item} navigation={this.props.navigation}/>
            <View>
                <Text style={styles.questions}> {item.item.questions}</Text>

                <Text style={styles.answers}> {item.item.answers}</Text>
            </View>
        )

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.White }} >
                <Header
                    bottomShadow={true}
                    back={true}
                    title={STRINGS.HelpAndFAQ}
                    navigation={this.props.navigation}
                />
                <WebViewScreen url='https://payride.ng/faq-driver' />

                {/* <View style={{ flexDirection: 'row' }}>
                    <FlatList
                        data={data}
                        renderItem={(item) => this.renderItem(item)}
                    />
                </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    questions: {
        flex: 1,
        flexWrap: 'wrap',
        marginTop: Utils.heightScaleSize(25),
        marginHorizontal: Utils.widthScaleSize(15),
        fontFamily: fontType.jost_SemiBold_600,
        fontSize: Utils.scaleSize(16),
        lineHeight: Utils.scaleSize(23),
        color: COLORS.Black
    },
    answers: {
        flex: 1,
        flexWrap: 'wrap',
        marginTop: Utils.heightScaleSize(9),
        marginHorizontal: Utils.widthScaleSize(15),
        fontFamily: fontType.jost_400,
        fontSize: Utils.scaleSize(14),
        lineHeight: Utils.scaleSize(24),
        color: COLORS.Black,
    },
})