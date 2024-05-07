import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {ECharts} from 'react-native-echarts-wrapper';
import COLORS from '../../common/colors/colors';
import STRINGS from '../../common/strings/strings';
import Utils from '../../common/util/Utils';
import fontType from '../../../assets/fontName/FontName';

const xAxisElementColor = {
  textStyle: {color: COLORS.lightGrey, fontSize: Utils.scaleSize(12)},
};
const emphasisColor = {itemStyle: {opacity: 1, color: COLORS.pColor}};
const itemStyleColor = {opacity: 1, color: COLORS.greyLight};

export class ResponsiveDateChart extends Component {
  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  render() {
    console.log('props', this.props);

    let option = {
      tooltip: {
        trigger: 'item',
        responsive: true,
        position: 'top',
        formatter: '{c}',
      },
      itemStyle: itemStyleColor,
      emphasis: emphasisColor,
      xAxis: {
        type: 'category',
        data: this.props.xAxisData,
        axisLabel: xAxisElementColor,
        // linecolor:"red",
        axisTick: {
          show: false,
          // alignWithLabel: true
        },
      },
      yAxis: {
        show: false,
        type: 'value',
      },

      series: [
        {
          data: this.props.yAxis,
          type: 'bar',
          barWidth: '80%',
        },
      ],
    };
    return (
      <ECharts
        style={{flex: 1}}
        ref={this.onRef}
        // ref={this.props.setRef}
        option={option}
        additionalCode={this.additionalCode}
        onData={this.onData}
        onLoadEnd={() => {
          this.chart.setBackgroundColor('transparent');
        }}
        notMerge={false}
      />
    );
  }
}

export class ResponsiveWeekChart extends Component {
  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  render() {
    console.log('props', this.props);

    let option = {
      tooltip: {
        trigger: 'item',
        responsive: true,
        position: 'top',
        formatter: '{c}',
      },
      itemStyle: itemStyleColor,
      emphasis: emphasisColor,
      xAxis: {
        barMaxWidth: 6,
        type: 'category',
        data: this.props.xAxisData,
        axisLabel: xAxisElementColor,
        axisTick: {show: false},
      },
      yAxis: {
        show: false,
        type: 'value',
      },

      series: [
        {
          data: this.props.yAxis,
          type: 'bar',
          barWidth: '50%',
        },
      ],
    };
    return (
      <ECharts
        style={{flex: 1}}
        ref={this.onRef}
        // ref={this.props.setRef}
        option={option}
        additionalCode={this.additionalCode}
        onData={this.onData}
        onLoadEnd={() => {
          this.chart.setBackgroundColor('transparent');
        }}
        notMerge={false}
      />
    );
  }
}

export class ResponsiveMonthChart extends Component {
  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  render() {
    console.log('props', this.props);

    let option = {
      tooltip: {
        trigger: 'item',
        responsive: true,
        position: 'top',
        formatter: '{c}',
      },
      itemStyle: itemStyleColor,
      emphasis: emphasisColor,
      xAxis: {
        barMaxWidth: 6,
        type: 'category',
        data: this.props.xAxisData,
        axisLabel: xAxisElementColor,
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        type: 'value',
      },

      series: [
        {
          data: this.props.yAxis,
          type: 'bar',
          barWidth: '50%',
        },
      ],
    };
    return (
      <ECharts
        style={{flex: 1}}
        ref={this.onRef}
        option={option}
        additionalCode={this.additionalCode}
        onData={this.onData}
        onLoadEnd={() => {
          this.chart.setBackgroundColor('transparent');
        }}
        notMerge={false}
      />
    );
  }
}

export class ResponsiveYearChart extends Component {
  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  render() {
    console.log('props', this.props);
    let option = {
      tooltip: {
        trigger: 'item',
        responsive: true,
        position: 'top',
        formatter: '{c}',
      },
      itemStyle: itemStyleColor,
      emphasis: emphasisColor,
      xAxis: {
        barMaxWidth: 6,
        type: 'category',
        data: this.props.xAxisData,
        axisLabel: xAxisElementColor,
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        type: 'value',
      },

      series: [
        {
          data: this.props.yAxis,
          type: 'bar',
          barWidth: '50%',
        },
      ],
    };
    return (
      <ECharts
        style={{flex: 1}}
        ref={this.onRef}
        option={option}
        additionalCode={this.additionalCode}
        onData={this.onData}
        onLoadEnd={() => {
          this.chart.setBackgroundColor('transparent');
        }}
      />
    );
  }
}
