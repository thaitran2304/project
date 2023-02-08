import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Icons } from '../Constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.0.106:7012',
})

function ChinhSuaKhoanThu({ route, navigation }) {
    const [currentDate, setCurrentDate] = React.useState(new Date(route.params.dateOfSpending));
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [idCategory, setIDCategory] = React.useState(1);
    const [note, setNote] = React.useState('');
    const [amount, setAmount] = React.useState(route.params.spendingDetail.amount.toString());
    const [id, setId] = React.useState(route.params.spendingDetail.id);
    const [userId, setUserId] = useState(0);
    const [categories, setCategories] = useState([]);
    const category = [
        {
            id: 0,
            name: 'Ăn uống',
        },
        {
            id: 1,
            name: 'Quần áo',
        },
        {
            id: 2,
            name: 'Mỹ phẩm',
        },
        {
            id: 3,
            name: 'Sinh hoạt',
        }
    ]

    useEffect(() => {
        instance.get('api/Spending/get-category-spends', {
            timeout: 5000,
        }).then(res => {
            setCategories(res.data);
        })
            .catch(error => console.log(error));
    }, [userId]);

    function updateSpending() {
        const data = {
            id: id,
            amount: amount,
            nameSpendingDetail: category[idCategory].name,
        };
        instance.patch('api/Spending/update', data).catch(error => {
            console.log(error.response)
        });
        route.params.onGoBack();
        navigation.goBack();
    }

    function deleteSpending(id) {
        instance.patch('api/Spending/delete/' + id).catch(error => {
            console.log(error.response)
        });
        route.params.onGoBack();
        navigation.goBack();
    }

    const onChange = (event, selectedDate) => {
        const date = selectedDate || currentDate;
        setCurrentDate(date);
        setShowDatePicker(false);
    }

    const renderCategory = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => setIDCategory(item.id)}
                style={{ width: 80, height: 80, backgroundColor: idCategory == item.id ? "#e0db47" : '#f5f299', marginRight: 12, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={{ height: 40, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: 25, height: 25, margin: 12, }}
                >
                    <Image source={Icons.back_icon} resizeMode='center' style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Chỉnh sửa</Text>
                </View>
                <TouchableOpacity
                    onPress={() => deleteSpending(id)}
                    style={{ width: 25, height: 25, margin: 12, }}
                >
                    <Image source={Icons.recycle_icon} resizeMode='center' style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>Ngày</Text>
                <View
                    style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', backgroundColor: '#f5f299', paddingVertical: 5, alignItems: 'center', borderRadius: 10, height: 40 }}
                    // onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ fontSize: 18 }}>{currentDate.getDate()}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', }}>
                <Text style={{ fontSize: 18, }}>Ghi chú</Text>
                <TextInput style={{ flex: 1, marginHorizontal: 10, height: 50, borderBottomWidth: 0.8 }}></TextInput>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', }}>
                <Text style={{ fontSize: 18, }}>Tiền chi</Text>
                <TextInput
                    value={amount}
                    style={{ flex: 1, marginHorizontal: 10, height: 50, borderBottomWidth: 0.8, fontSize: 20 }}
                    onChangeText={(text) => setAmount(text)}
                />
            </View>
            <View style={{ paddingTop: 20, paddingLeft: 15 }}>
                <Text style={{ fontSize: 20, paddingBottom: 15 }}>Danh mục</Text>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={item => `${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20, paddingHorizontal: 30 }}>
                <TouchableOpacity
                    onPress={() => updateSpending()}
                    style={{ backgroundColor: '#f6aa64', height: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chỉnh sửa khoản thu</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (<DateTimePicker
                testID='dateTimePicker'
                value={currentDate}
                mode={'date'}
                display='default'
                onChange={onChange}
            />)}
        </SafeAreaView>
    )
}

function ChinhSuaKhoanChi({ route, navigation }) {
    const [currentDate, setCurrentDate] = React.useState(new Date(route.params.dateOfSpending));
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [idCategory, setIDCategory] = React.useState(1);
    const [note, setNote] = React.useState('');
    const [amount, setAmount] = React.useState(route.params.spendingDetail.amount.toString());
    const [id, setId] = React.useState(route.params.spendingDetail.id);
    const [userId, setUserId] = useState(0);
    const category = [
        {
            id: 0,
            name: 'Tiền lương',
        },
        {
            id: 1,
            name: 'Tiền tiết kiệm',
        },
        {
            id: 2,
            name: 'Đầu tư',
        },
        {
            id: 3,
            name: 'Thu nhập phụ',
        },
        {
            id: 4,
            name: 'Tiền thưởng',
        },
        {
            id: 5,
            name: 'Khác',
        }
    ]

    useEffect(() => {
        
    }, [userId]);

    function updateSpending() {
        const data = {
            id: id,
            amount: amount,
            nameSpendingDetail: category[idCategory].name,
        };
        instance.patch('api/Spending/update', data).catch(error => {
            console.log(error.response)
        });
        route.params.onGoBack();
        navigation.goBack();
    }

    function deleteSpending(id) {
        instance.patch('api/Spending/delete/' + id).catch(error => {
            console.log(error.response)
        });
        route.params.onGoBack();
        navigation.goBack();
    }

    const onChange = (event, selectedDate) => {
        const date = selectedDate || currentDate;
        setCurrentDate(date);
        setShowDatePicker(false);
    }

    const renderCategory = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => setIDCategory(item.id)}
                style={{ width: 80, height: 80, backgroundColor: idCategory == item.id ? "#e0db47" : '#f5f299', marginRight: 12, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.AndroidSafeArea}>
            <View style={{ height: 40, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ width: 25, height: 25, margin: 12, }}
                >
                    <Image source={Icons.back_icon} resizeMode='center' style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Chỉnh sửa</Text>
                </View>
                <TouchableOpacity
                    onPress={() => deleteSpending(id)}
                    style={{ width: 25, height: 25, margin: 12, }}
                >
                    <Image source={Icons.recycle_icon} resizeMode='center' style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>Ngày</Text>
                {/* <TouchableOpacity
                    style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', backgroundColor: '#f5f299', paddingVertical: 5, alignItems: 'center', borderRadius: 10, height: 40 }}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ fontSize: 18 }}>{currentDate.getDate()}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</Text>
                </TouchableOpacity> */}
                <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', backgroundColor: '#f5f299', paddingVertical: 5, alignItems: 'center', borderRadius: 10, height: 40 }}>
                    <Text style={{ fontSize: 18 }}>{currentDate.getDate()}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', }}>
                <Text style={{ fontSize: 18, }}>Ghi chú</Text>
                <TextInput style={{ flex: 1, marginHorizontal: 10, height: 50, borderBottomWidth: 0.8 }}></TextInput>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', }}>
                <Text style={{ fontSize: 18, }}>Tiền chi</Text>
                <TextInput
                    value={amount}
                    style={{ flex: 1, marginHorizontal: 10, height: 50, borderBottomWidth: 0.8, fontSize: 20 }}
                    onChangeText={(text) => setAmount(text)}
                />
            </View>
            <View style={{ paddingTop: 20, paddingLeft: 15 }}>
                <Text style={{ fontSize: 20, paddingBottom: 15 }}>Danh mục</Text>
                <FlatList
                    data={category}
                    renderItem={renderCategory}
                    keyExtractor={item => `${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20, paddingHorizontal: 30 }}>
                <TouchableOpacity
                    onPress={() => updateSpending()}
                    style={{ backgroundColor: '#f6aa64', height: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chỉnh sửa khoản chi</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (<DateTimePicker
                testID='dateTimePicker'
                value={currentDate}
                mode={'date'}
                display='default'
                onChange={onChange}
            />)}
        </SafeAreaView>
    )
}

export { ChinhSuaKhoanChi, ChinhSuaKhoanThu };

const BlackMask = {
    backgroundColor: 'black',
    opacity: 0.1,
}
const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    status: {
        height: 50,
        backgroundColor: '#76ab84',
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
