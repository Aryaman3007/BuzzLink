import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'

export default function ChartStats({ data, days }) {
    const isSevenDays = days === '7';
    const isThirtyDays = days === '30';

    if (isSevenDays) {
        return (
            <LineChart
                data={data}
                width={340}
                height={180}
                chartConfig={{
                    backgroundColor: "#e6effd",
                    backgroundGradientFrom: '#1b3039',
                    backgroundGradientTo: '#233d49',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "2",
                        stroke: '#e6effd'
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                        //strokeWidth: 0,
                    }
                }}
                //withInnerLines={false}
                bezier
                style={{
                    borderRadius: 15,
                }}
            />
        );
    } else if (isThirtyDays) {
        return (
            <LineChart
                data={data}
                width={350}
                height={190}
                chartConfig={{
                    backgroundColor: "#e6effd",
                    backgroundGradientFrom: '#1b3039',
                    backgroundGradientTo: '#233d49',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "2",
                        stroke: '#e6effd'
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                        //strokeWidth: 0,
                    }
                }}
                //withInnerLines={false}
                bezier
                style={{
                    borderRadius: 15
                }}
                hidePointsAtIndex={Array.from({ length: 30 }, (v, k) => (k % 5 !== 0) ? k : null).filter(value => value !== null)}
            />
        );
    }
}

const styles = StyleSheet.create({});
