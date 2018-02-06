import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View , FlatList} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import XDate from 'xdate';

export default class ScheduleCalendar extends Component {
    constructor(props) {
        super(props);
        LocaleConfig.locales['cn_zh'] = {
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
        };
        LocaleConfig.defaultLocale = 'cn_zh';
        const today = new XDate();
        today.setHours(0, 0, 0, 0);
        this.state = {
            listLoading: false,
            calendarLoading: false,
            selected: today,
            selectedDateStr: today.toString('yyyy-MM-dd'),
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
                    monthFormat={'yyyy年MM月'}
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
        const selected = new XDate(timestamp);
        selected.setHours(0, 0, 0, 0);
        this.setState({
            selected,
            selectedDateStr: selected.toString('yyyy-MM-dd')
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