import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View , FlatList} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TimeUtils } from '@hecom/aDate';

export default class ScheduleCalendar extends Component {
    constructor(props) {
        super(props);
        TimeUtils.locale('zh-cn');
        const today = TimeUtils.create().startOfDay();
        this.state = {
            listLoading: false,
            calendarLoading: false,
            selected: today,
            selectedDateStr: today.format('YYYY-MM-DD'),
            marked: {},
            data: [],
        };
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const {selected, data} = this.state;
        return (
            <View style={[styles.container, this.props.style]}>
                <Calendar
                    style={styles.calendar}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        todayTextColor: '#e15151',
                        monthTextColor: '#666666',
                        textMonthFontSize: 13,
                        textTodayFontSize: 13,
                        textDayHeaderFontSize: 12
                    }}
                    onDayPress={this.onDayPress}
                    monthFormat={'YYYY年MM月'}
                    onMonthChange={this.onMonthChange}
                    hideArrows={false}
                    hideExtraDays={true}
                    firstDay={7}
                    markedDates={this.markedAndSelect()}
                />
                <View style={[styles.label]}>
                    {this.renderDayCount()}
                </View>
                <FlatList
                    renderItem={({item}) => <ScheduleItem item={item} />}
                    renderSectionHeader={this.renderSectionHeader}
                    ListEmptyComponent={this.renderEmptyList}
                />
            </View>
        );
    }

    markedAndSelect = () => {
        const {marked, selectedDateStr} = this.state;
        const result = {...marked};
        result[selectedDateStr] = {...result[selectedDateStr], selected: true};
        return result;
    };

    renderEmptyList = () => {
        return (
            <View style={styles.emptyLayout}>
                <Text style={styles.emptyHint}>创建更多内容</Text>
                <View style={styles.emptyContent}>
                    <Text style={styles.emptyContentItemText}>拜访</Text>
                    <Text style={styles.emptyContentItemText}>任务</Text>
                    <Text style={styles.emptyContentItemText}>会议</Text>
                    <Text style={styles.emptyContentItemText}>培训</Text>
                </View>
            </View>
        );
    };

    renderDayCount = () => {
        const {listLoading, marked, selectedDateStr} = this.state
        if (listLoading) {
            return (
                <View style={styles.dayCount}>
                    <Text style={styles.dayCountText}>查询中...</Text>
                    <ActivityIndicator />
                </View>
            );
        } else {
            let count = 0;
            if (marked[selectedDateStr]) {
                count = marked[selectedDateStr].marked || 0;
            }
            return (
                <Text style={[styles.dayCountText, styles.dayCount]}>
                    {this.props.scope + "（" + count + "）"}
                </Text>
            );
        }
    };

    onMonthChange = ({timestamp}) => {
        this.updateSelected(timestamp);
    };

    onDayPress = (day) => {
        const selected = this.updateSelected(day.timestamp);
    };

    updateSelected = (timestamp) => {
        const selected = TimeUtils.create(timestamp).startOfDay();
        this.setState({
            selected,
            selectedDateStr: selected.format('YYYY-MM-DD')
        });
        return selected;
    }
}

const styles = StyleSheet.create({
    container: {marginTop: 10, flex: 1},
    calendar: {flex: 0},
    label: {flexDirection: 'row', height: 40, marginTop: 10, backgroundColor: 'white'},
    dayCount: {flex: 1, flexDirection: 'row', paddingLeft: 16},
    dayCountText: {
        height: 40,
        fontSize: 14, color: '#333', ...Platform.select({
            ios: {lineHeight: 40,},
            android: {textAlignVertical: 'center'}
        })
    },
    filter: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyLayout: {
        paddingTop: 50,
        alignItems: 'center',
    },
    emptyHint: {
        fontSize: 16,
        color: '#b2b2b2'
    },
    emptyContent: {
        marginTop: 20,
        flexDirection: 'row'
    },
    emptyContentItemText: {
        fontSize: 14,
        color: '#bcbcbc',
        marginLeft: 18,
        marginRight: 18,
    }
});
