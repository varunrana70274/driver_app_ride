import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ResponsiveDateChart,
  ResponsiveWeekChart,
  ResponsiveMonthChart,
  ResponsiveYearChart,
} from '../../common/base_components';
import fontType from '../../../assets/fontName/FontName';
import ImageName from '../../../assets/imageName/ImageName';
import {Header} from '../../common/base_components';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import {
  MY_EARNINGS_DAILY_SUCCESS,
  MY_EARNINGS_DATA,
  MY_EARNINGS_KEY,
  MY_EARNINGS_MONTHLY_SUCCESS,
  MY_EARNINGS_REQEUST_LOADING,
  MY_EARNINGS_ROOT,
  MY_EARNINGS_WEEKLY_SUCCESS,
  MY_EARNINGS_YEARLY_SUCCESS,
  MY_TOTAL_EARNINGS,
} from '../../redux/Types';
import {
  MyEarningsFormData,
  MyEarningsRequest,
} from '../../redux/driverEarnings/Action';
import {connect} from 'react-redux';
import moment from 'moment';

const DATA = [
  {
    trip_id: 98989,
    price: '₦ 969.46',
    date: '13 Mar, 2022-04:35 pm',
    type: 'monthly',
    name: 'Musa',
  },
  {
    trip_id: 98989,
    price: '₦ 69.46',
    date: '13 Mar, 2022-04:35 pm',
    type: 'monthly',
    name: 'Musa',
  },
  {
    trip_id: 98989,
    price: '₦ 969.46',
    date: '13 Mar, 2022-04:35 pm',
    type: 'monthly',
    name: 'Musa',
  },
  {
    trip_id: 98989,
    price: '₦ 969.46',
    date: '13 Mar, 2022-04:35 pm',
    type: 'monthly',
    name: 'Musa',
  },
];

const date = new Date();
class MyEarnings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'daily',
      add: 0,
      year: date.getFullYear(),
      xAxisDailyData: [moment(new Date()).format('dddd')],
      yAxisDailyData: [{id: 0, value: 1120}],
      xAxisWeeklyData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'sat'],
      yAxisWwwklyData: [
        {id: 0, value: 1120},
        {id: 0, value: 120},
        {id: 0, value: 1120},
        {id: 0, value: 1120},
        {id: 0, value: 20},
        {id: 0, value: 0},
      ],
      monthNames: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
  }

  componentDidMount() {
    this.props?.navigation?.addListener('focus', () => {
      this.getMyEarnings();
    });
  }
  selectedChartDate = () => {
    let curr = new Date();
    let firstDay = curr.getDate() - curr.getDay();
    let lastDay = curr.getDate() - curr.getDay() + 6;
    if (this.state.selected == 'daily') {
      return date.getDate() + ' ' + this.state.monthNames[date.getUTCMonth()];
    } else if (this.state.selected == 'weekly') {
      return (
        firstDay +
        '/' +
        date.getUTCMonth() +
        '/' +
        date.getFullYear().toString().slice(-2) +
        ' - ' +
        lastDay +
        '/' +
        date.getUTCMonth() +
        '/' +
        date.getFullYear().toString().slice(-2)
      );
    } else if (this.state.selected == 'monthly') {
      return (
        this.state.monthNames[date.getUTCMonth()] + ' ' + date.getFullYear()
      );
    } else if (this.state.selected == 'yearly') {
      return date.getFullYear();
    }
  };
  getMyEarnings = () => {
    this.props.MyEarningsRequest(this.state.selected);
  };
  render() {
    let {
      my_total_earnings,
      my_earnings_daily_success,
      my_earnings_loading,
      my_earnings_weekly_success,
      my_earnings_monthly_success,
      my_earnings_yearly_success,
      my_earnings_data,
    } = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.White}}>
        <Header
          bottomShadow={false}
          back={false}
          title={STRINGS.myEarnings}
          navigation={this.props.navigation}
        />

        {/* <ScrollView contentContainerStyle={{ flex: 1, }} > */}
        <View style={{flex: 1}}>
          <View
            style={{
              marginVertical: Utils.heightScaleSize(10),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({selected: 'daily'}, () => this.getMyEarnings())
              }
              style={[
                styles.dailyOuter,
                {
                  backgroundColor:
                    this.state.selected == 'daily'
                      ? COLORS.pColor
                      : COLORS.greyLight,
                },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    color:
                      this.state.selected == 'daily'
                        ? COLORS.White
                        : COLORS.Black,
                  },
                ]}>
                {STRINGS.daily}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({selected: 'weekly'}, () => this.getMyEarnings())
              }
              style={[
                styles.dailyOuter,
                {
                  backgroundColor:
                    this.state.selected == 'weekly'
                      ? COLORS.pColor
                      : COLORS.greyLight,
                },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    color:
                      this.state.selected == 'weekly'
                        ? COLORS.White
                        : COLORS.Black,
                  },
                ]}>
                {STRINGS.weekly}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({selected: 'monthly'}, () => this.getMyEarnings())
              }
              style={[
                styles.dailyOuter,
                {
                  backgroundColor:
                    this.state.selected == 'monthly'
                      ? COLORS.pColor
                      : COLORS.greyLight,
                },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    color:
                      this.state.selected == 'monthly'
                        ? COLORS.White
                        : COLORS.Black,
                  },
                ]}>
                {STRINGS.monthly}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({selected: 'yearly'}, () => this.getMyEarnings())
              }
              style={[
                styles.dailyOuter,
                {
                  backgroundColor:
                    this.state.selected == 'yearly'
                      ? COLORS.pColor
                      : COLORS.greyLight,
                },
              ]}>
              <Text
                style={[
                  styles.txt,
                  {
                    color:
                      this.state.selected == 'yearly'
                        ? COLORS.White
                        : COLORS.Black,
                  },
                ]}>
                {STRINGS.yearly}
              </Text>
            </TouchableOpacity>
          </View>
          {my_earnings_loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.amount}>₦ {my_total_earnings}</Text>
              <Text style={styles.earning}>Earnings</Text>
              {this.state.selected == 'daily' ? (
                <ResponsiveDateChart
                  clicked={this.state.add}
                  type={this.state.selected}
                  xAxisData={this.state.xAxisDailyData}
                  yAxis={my_earnings_daily_success}
                />
              ) : (
                <View style={{flex: 1, backgroundColor: 'pink'}}>
                  {this.state.selected == 'weekly' ? (
                    <ResponsiveWeekChart
                      clicked={this.state.add}
                      type={this.state.selected}
                      xAxisData={Object.keys(my_earnings_weekly_success)}
                      yAxis={Object.values(my_earnings_weekly_success)}
                    />
                  ) : (
                    <View style={{flex: 1}}>
                      {this.state.selected == 'monthly' ? (
                        <ResponsiveMonthChart
                          clicked={this.state.add}
                          type={this.state.selected}
                          xAxisData={Object.keys(my_earnings_monthly_success)}
                          yAxis={Object.values(my_earnings_monthly_success)}
                        />
                      ) : (
                        <ResponsiveYearChart
                          clicked={this.state.add}
                          type={this.state.selected}
                          xAxisData={Object.keys(my_earnings_yearly_success)}
                          yAxis={Object.values(my_earnings_yearly_success)}
                        />
                      )}
                    </View>
                  )}
                </View>
              )}

              <Text style={styles.type}>{this.selectedChartDate()}</Text>
              <ScrollView style={{flex: 1}}>
                {my_earnings_data.length == 0 ? (
                  <Text
                    style={{
                      marginTop: Utils.heightScaleSize(10),
                      fontSize: Utils.scaleSize(16),
                      alignSelf: 'center',
                      fontFamily: fontType.jost_SemiBold_600,
                      color: COLORS.Black,
                    }}>
                    No Earnings Found...
                  </Text>
                ) : null}
                {my_earnings_data.map((item, index) => {
                  return (
                    <View key={index} style={{width: '100%'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row', width: '100%'}}>
                          <Image
                            source={ImageName.calender}
                            style={styles.cal}
                          />
                          <View
                            style={{
                              width: '80%',
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                            }}>
                            <View>
                              <Text style={styles.date}>
                                {moment(item.ride_completion_datetime).format(
                                  'MMM Do YYYY, h:mm a',
                                )}
                              </Text>
                              <View
                                style={{
                                  marginBottom: Utils.heightScaleSize(5),
                                  marginTop: Utils.heightScaleSize(10),
                                }}>
                                <Text style={styles.tripId}>
                                  Trip ID: {item.trip_id}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      marginHorizontal: Utils.widthScaleSize(5),
                                      height: Utils.scaleSize(5),
                                      width: Utils.scaleSize(5),
                                      borderRadius: Utils.scaleSize(5),
                                      backgroundColor: COLORS.pColor,
                                      marginLeft: 0,
                                    }}
                                  />
                                  <Text style={styles.tripId}>
                                    {item.customer.name}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={[styles.date, {color: COLORS.sColor}]}>
                                {item.final_amount}
                              </Text>
                              <Text
                                style={[styles.tip, {color: COLORS.sColor}]}>
                                Tip:{item.driver_tip}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          height: Utils.heightScaleSize(5),
                          width: '100%',
                          backgroundColor: COLORS.graylight,
                          marginVertical: Utils.heightScaleSize(10),
                        }}
                      />
                    </View>
                  );
                })}

                {/* {DATA.map((item, index) => {
                                return (
                                    <View key={index} style={{ width: "100%" }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', width: "100%", }}>
                                                <Image source={ImageName.calender} style={styles.cal} />
                                                <View style={{ width: "80%", justifyContent: 'space-between', flexDirection: 'row', }}>
                                                    <View>
                                                        <Text style={styles.date}>{item.date}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Utils.heightScaleSize(5), marginTop: Utils.heightScaleSize(10) }}>
                                                            <Text style={styles.tripId}>Trip ID: {item.trip_id}</Text>
                                                            <View style={{ marginHorizontal: Utils.widthScaleSize(5), height: Utils.scaleSize(5), width: Utils.scaleSize(5), borderRadius: Utils.scaleSize(5), backgroundColor: COLORS.pColor }} />
                                                            <Text style={styles.tripId} >{item.name}</Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.date, { color: COLORS.sColor }]} >{item.price}</Text>
                                                    </View>
                                                </View>

                                            </View>

                                        </View>

                                        <View style={{ height: Utils.heightScaleSize(5), width: '100%', backgroundColor: COLORS.graylight, marginVertical: Utils.heightScaleSize(10) }} />
                                    </View>
                                )
                            })} */}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tip: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(10),
    lineHeight: Utils.scaleSize(20),
  },
  date: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.Black,
    fontSize: Utils.scaleSize(15),
    lineHeight: Utils.scaleSize(20),
  },
  tripId: {
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(12),
    lineHeight: Utils.scaleSize(17),
  },
  amount: {
    textAlign: 'center',
    fontFamily: fontType.Poppins_SemiBold_600,
    color: COLORS.pColor,
    fontSize: Utils.scaleSize(20),
    lineHeight: Utils.scaleSize(23),
  },
  earning: {
    textAlign: 'center',
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.lightGrey,
    fontSize: Utils.scaleSize(14),
    lineHeight: Utils.scaleSize(20),
  },
  cal: {
    height: Utils.scaleSize(15),
    width: Utils.scaleSize(15),
    marginTop: Utils.heightScaleSize(3),
    marginHorizontal: Utils.scaleSize(14),
  },
  type: {
    marginLeft: Utils.widthScaleSize(18),
    fontFamily: fontType.jost_Medium_500,
    color: COLORS.pColor,
    fontSize: Utils.scaleSize(22),
    lineHeight: Utils.scaleSize(28),
  },

  txt: {
    color: COLORS.White,
    fontFamily: fontType.Poppins_Medium_500,
    marginHorizontal: Utils.widthScaleSize(13),
    marginVertical: Utils.heightScaleSize(8),
  },
  dailyOuter: {
    backgroundColor: COLORS.pColor,
    borderRadius: Utils.scaleSize(10),
  },
  opacity: {
    height: Utils.scaleSize(75),
    width: Utils.scaleSize(75),
    backgroundColor: COLORS.lightGrey,
    borderRadius: Utils.scaleSize(10),
    margin: Utils.scaleSize(10),
    justifyContent: 'center',
  },
});

const mapStateToProps = ({my_earnings}) => {
  const my_earnings_key =
    my_earnings && my_earnings[MY_EARNINGS_KEY]
      ? my_earnings[MY_EARNINGS_KEY]
      : {};
  const my_earnings_loading =
    my_earnings_key && my_earnings_key[MY_EARNINGS_REQEUST_LOADING]
      ? my_earnings_key[MY_EARNINGS_REQEUST_LOADING]
      : false;
  const my_earnings_daily_success =
    my_earnings_key && my_earnings_key[MY_EARNINGS_DAILY_SUCCESS]
      ? my_earnings_key[MY_EARNINGS_DAILY_SUCCESS]
      : [];
  const my_earnings_weekly_success =
    my_earnings_key && my_earnings_key[MY_EARNINGS_WEEKLY_SUCCESS]
      ? my_earnings_key[MY_EARNINGS_WEEKLY_SUCCESS]
      : [];
  const my_earnings_monthly_success =
    my_earnings_key && my_earnings_key[MY_EARNINGS_MONTHLY_SUCCESS]
      ? my_earnings_key[MY_EARNINGS_MONTHLY_SUCCESS]
      : [];
  const my_earnings_yearly_success =
    my_earnings_key && my_earnings_key[MY_EARNINGS_YEARLY_SUCCESS]
      ? my_earnings_key[MY_EARNINGS_YEARLY_SUCCESS]
      : [];
  const my_total_earnings = my_earnings_key[MY_TOTAL_EARNINGS];
  const my_earnings_data =
    my_earnings_key && my_earnings_key[MY_EARNINGS_DATA]
      ? my_earnings_key[MY_EARNINGS_DATA]
      : [];

  return {
    my_earnings_loading,
    my_earnings_daily_success,
    my_earnings_weekly_success,
    my_earnings_monthly_success,
    my_earnings_yearly_success,
    my_total_earnings,
    my_earnings_data,
  };
};

const mapDispatchToProps = {
  MyEarningsFormData,
  MyEarningsRequest,
};
export default connect(mapStateToProps, mapDispatchToProps)(MyEarnings);
