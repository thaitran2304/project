import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda, AgendaList } from 'react-native-calendars';
import axios from 'axios';

// const formatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'VND',
// });
const formatter = new Intl.NumberFormat('en-US');

function ThongKeScreen({ route, navigation }) {
    const instance = axios.create({
        baseURL: 'http://192.168.0.106:7012',
    })

    const [spending, setSpending] = React.useState(route.params.spending);
    const [spendingDetail, setSpendingDetail] = React.useState(route.params.spendingDetail);
    const [totalSpending, setTotalSpending] = React.useState(route.params.totalSpending);

    function changeScreen(screen, item, date) {
        let month = new Date(date).getMonth() + 1;
        let day = new Date(date).getDate();
        if (day < 10) {
            day = '0' + day;
        }
        let a = '';
        a += new Date(date).getFullYear() + '-';
        a += month + '-';
        a += day;

        if (screen == 1) {
            navigation.navigate("KhoanThu", {
                spendingDetail: item,
                dateOfSpending: a,
                onGoBack: () => refresh(),
            });
        }
        else if (screen == 2) {
            navigation.navigate("KhoanChi", {
                spendingDetail: item,
                dateOfSpending: a,
                onGoBack: refresh,
            });
        }
    }

    const refresh = () => {
        let currentdate = new Date(spending[0].dateOfSpending);

        instance.get('api/Spending/get-all-spending-in-month', {
            timeout: 5000,
            params: {
                month: currentdate.getMonth() + 1,
                year: currentdate.getFullYear()
            }
        }).then(res => {
            instance.get('api/Spending/get-total-spending-income', {
                timeout: 5000,
                params: {
                    month: currentdate.getMonth() + 1,
                    year: currentdate.getFullYear()
                }
            }).then(res => {
                setTotalSpending(res.data);
            })
                .catch(error => console.log(error));

            if (res.data.length > 0) {
                setSpending(res.data);
                let numberElement = res.data.length;
                // console.log(res.data);
                let dict = {};
                for (let i = 0; i < res.data.length; i++) {
                    let date = new Date(res.data[i].dateOfSpending);
                    instance.get('api/Spending/get-all-spending-detail-in-specific-day', {
                        timeout: 5000,
                        params: {
                            month: date.getMonth() + 1,
                            year: date.getFullYear(),
                            day: date.getDate()
                        }
                    }).then(res => {
                        // console.log(res);
                        // console.log(res.data);
                        dict[date.getDate()] = res.data;
                        if (i == numberElement - 1) {
                            setSpendingDetail(dict);
                        }
                    })
                        .catch(error => console.log(error));
                }
                // console.log(spending);
            }
            else {
                setSpending([]);
                console.log('No data');
            }
        })
            .catch(error => console.log(error));
    }

    function dateToString(date) {
        let month = new Date(date.dateOfSpending).getMonth() + 1;
        let day = new Date(date.dateOfSpending).getDate();
        if (day < 10) {
            day = '0' + day;
        }
        let a = '';
        a += new Date(date.dateOfSpending).getFullYear() + '-';
        a += month + '-';
        a += day;
        return a;
    }

    function getMarkedDates(spending) {
        const marked = {};
        spending.forEach(item => { marked[dateToString(item)] = { marked: true }; });
        return JSON.parse(JSON.stringify(marked));
    };

    function monthChange(month) {
        instance.get('api/Spending/get-all-spending-in-month', {
            timeout: 5000,
            params: {
                month: month.month,
                year: month.year
            }
        }).then(res => {
            // console.log(res);
            // console.log(res.data);

            instance.get('api/Spending/get-total-spending-income', {
                timeout: 5000,
                params: {
                    month: month.month,
                    year: month.year,
                }
            }).then(res => {
                setTotalSpending(res.data);
            })
                .catch(error => console.log(error));

            if (res.data.length > 0) {
                setSpending(res.data);
                let numberElement = res.data.length;
                // console.log(res.data);
                let dict = {};
                for (let i = 0; i < res.data.length; i++) {
                    let date = new Date(res.data[i].dateOfSpending);
                    instance.get('api/Spending/get-all-spending-detail-in-specific-day', {
                        timeout: 5000,
                        params: {
                            month: date.getMonth() + 1,
                            year: date.getFullYear(),
                            day: date.getDate()
                        }
                    }).then(res => {
                        // console.log(res);
                        // console.log(res.data);
                        dict[date.getDate()] = res.data;
                        if (i == numberElement - 1) {
                            setSpendingDetail(dict);
                        }
                    })
                        .catch(error => console.log(error));
                }
                // console.log(spending);
            }
            else {
                setSpending([]);
                console.log('No data');
            }
        })
            .catch(error => console.log(error));
    }

    function renderSpendingDetail(date) {
        let day = new Date(date);
        if (spendingDetail[day.getDate()] == undefined)
            return (
                <View></View>
            )

        return (
            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 10 }}>
                {spendingDetail[day.getDate()].map((spend) =>
                    <TouchableOpacity
                        onPress={() => changeScreen(spend.type, spend, day)}
                        style={{ flexDirection: 'row', paddingVertical: 2, }}
                        key={spend.id}
                    >
                        <Text>{spend.name}</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10, }}>
                            <Text style={{ color: spend.type == 1 ? '#d84841' : spend.type == 2 ? '#4188d8' : 'black' }}>{formatter.format(spend.amount)}đ</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    function renderList(items) {
        if (items == undefined) {
            return (
                <View></View>
            )
        }

        const renderItem = ({ item, index }) => {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: '#f5f299', marginHorizontal: 10, marginVertical: 5, borderRadius: 10 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: 25, padding: 10 }}>{new Date(item.dateOfSpending).getDate()}<Text style={{ fontSize: 15 }}>th</Text></Text>
                    </View>
                    <Line></Line>
                    {renderSpendingDetail(new Date(item.dateOfSpending))}
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, marginTop: 12 }}>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => `${item.id}`}
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <Calendar
                // loadItemsForMonth={month => {
                //     monthChange(month);
                //   }}
                onDayPress={(day) => navigation.navigate("Create", {
                    day: day,
                    onGoBack: () => refresh(),
                })}
                onMonthChange={(month) => monthChange(month)}
                // markedDates={{
                //     '2022-11-22': { marked: true },
                //     '2022-11-23': { marked: true },
                //     '2022-11-24': { marked: true },
                //     '2022-11-25': { marked: true },
                //     '2022-11-26': { marked: true },
                //     '2022-11-27': { marked: true },
                // }}
                markedDates={getMarkedDates(spending)}

                dayComponent={({ date, state }) => {
                    return (
                        <View>
                            <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>{date.day}</Text>
                            <Text style={{ alignSelf: 'flex-end', color: '#d84841' }}>0</Text>
                            <Text style={{ alignSelf: 'flex-end', color: '#4188d8' }}>0</Text>
                        </View>
                    );
                }}

                theme={{ backgroundColor: '#fffee5', calendarBackground: '#fffee5', }}
            />
            <View style={styles.status}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Thu nhập</Text>
                    <Text>{formatter.format(totalSpending.income)}đ</Text>
                </View>
                <Line></Line>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Chi tiêu</Text>
                    <Text>{formatter.format(totalSpending.spending)}đ</Text>
                </View>
                <Line></Line>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Tổng</Text>
                    <Text>{totalSpending.total > 0 ? ('+' + formatter.format(totalSpending.total)) : formatter.format(totalSpending.total)}đ</Text>
                </View>
            </View>
            <View style={{ flex: 1, }}>
                {renderList(spending)}
                {/* {renderList([])} */}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    // onPress={() => navigation.navigate}
                    style={{ height: 60, width: 250, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f299', marginBottom: 12, borderRadius: 20 }}
                >
                    <Text>View Chart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const Line = () => {
    return (
        <View style={{ width: 1, paddingVertical: 10 }}>
            <View style={{ flex: 1, borderLeftColor: "#EFEFF0", borderLeftWidth: 1 }}></View>
        </View>
    )
}

export default ThongKeScreen;

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: '#fffee5',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    status: {
        height: 50,
        backgroundColor: '#f5f299',
        borderRadius: 10,
        margin: 10,
        flexDirection: 'row',
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
});
