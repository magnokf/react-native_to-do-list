import { useState, useContext } from 'react';
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import uuid from 'react-native-uuid';
import { Feather, Ionicons } from '@expo/vector-icons';

import { Task, TaskProps } from '../../components/Task';
import { TasksContext } from '../../contexts/tasks';

import { styles } from './styles';
import { THEME } from '../../theme';
import LogoImg from '../../../assets/logo.png';
import EmptyListImg from '../../../assets/clipboard.png';

export function Home() {
    const [taskDescription, setTaskDescription] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const {
        tasks,
        setTasks,
        completedTasks,
        setCompletedTasks,
        setAreAllCompleted
    } = useContext(TasksContext);

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    function handleAddNewTask() {

        const newTask: TaskProps = {
            id: uuid.v4().toString(),
            description: taskDescription.toUpperCase(),
            isChecked: false
        };
        if(newTask.description.length < 3) {
            Alert.alert("Tarefa inválida", "Digite uma tarefa válida. Minimo de 3 caracteres.");
            return;
        }

        if (newTask.description.trim() === '') {
            Alert.alert("Tarefa inválida", "Digite uma tarefa válida.");
            return;
        }

        if(tasks.filter(task => task.description.trim() === newTask.description.trim()).length > 0) {
            Alert.alert(`Tarefa já cadastrada`, `A tarefa "${newTask.description}" já exite.`);
            return;
        }

        setTasks(prevState => [
            ...prevState,
            newTask
        ]);
        setTaskDescription('');
    }

    function handleRemoveTask(id: string) {
        Alert.alert("Excluir", `Excluir tarefa?`, [
            {
                text: "Sim",
                onPress: () => {
                    const isItemChecked = tasks.find(task => task.id === id && task.isChecked);

                    if (isItemChecked) {
                        setCompletedTasks(prevState => prevState - 1);
                    }

                    setTasks(prevState => prevState.filter(task => task.id !== id));
                }
            },
            {
                text: "Não",
                style: "cancel"
            }
        ]);
    }

    function handleRemoveAllTasks() {
        Alert.alert("Excluir", `Excluir todas as tarefas?`, [
            {
                text: "Sim",
                onPress: () => {
                    setTasks([]);
                    setCompletedTasks(0);
                }
            },
            {
                text: "Não",
                style: "cancel"
            }
        ]);
    }

    function handleCompleteAllTasks() {
        if (tasks.length === completedTasks) {
            Alert.alert("Tarefas já concluídas");
            return;
        }

        Alert.alert("Concluir", `Concluir todas as tarefas?`, [
            {
                text: "Sim",
                onPress: () => {
                    setAreAllCompleted(true);
                    setCompletedTasks(tasks.length);
                }
            },
            {
                text: "Não",
                style: "cancel"
            }
        ]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={LogoImg}
                />
            </View>

            <View style={styles.body}>
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, isFocused ? styles.onFocusInput : {}]}
                        placeholder="Adicione uma nova tarefa"
                        placeholderTextColor={THEME.COLORS.GRAY_300}
                        onChangeText={setTaskDescription}
                        value={taskDescription}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        keyboardAppearance='dark'
                    />

                    <TouchableOpacity style={styles.addButton} onPress={handleAddNewTask}>
                        <Feather name="plus-circle" size={20} color={THEME.COLORS.GRAY_100} />
                    </TouchableOpacity>
                </View>

                <View style={[
                    styles.countersContainer,
                    tasks.length > 0 ? {borderBottomWidth: 0} : undefined
                ]}
                >
                    <View style={styles.counter}>
                        <Text style={[styles.counterText, {color: THEME.COLORS.BLUE}]}>Criadas </Text>
                        <View style={styles.counterNumberContainer}>
                            <Text style={styles.counterNumber}>{tasks.length}</Text>
                        </View>
                    </View>

                    <View style={styles.counter}>
                        <Text style={[styles.counterText, {color: THEME.COLORS.PURPLE}]}>Concluídas </Text>
                        <View style={styles.counterNumberContainer}>
                            <Text style={styles.counterNumber}>{completedTasks}</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Task
                            item={item}
                            onRemove={() => handleRemoveTask(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyListContainer}>
                            <Image source={EmptyListImg} style={styles.emptyListImage} />
                            <Text style={[styles.emptyListText, {fontFamily: THEME.FONT_FAMILY.BOLD}]}>
                                Você ainda não tem tarefas cadastradas
                            </Text>
                            <Text style={styles.emptyListText}>
                                Crie as tarefas e organize seus itens a fazer
                            </Text>
                        </View>
                    )}
                />
            </View>

            {tasks.length > 0 ? (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.footerButtons, { backgroundColor: THEME.COLORS.PURPLE_DARK }]}
                        onPress={handleCompleteAllTasks}
                    >
                        <Ionicons name="checkmark-done-circle-outline" size={28} color={THEME.COLORS.GRAY_200} />
                        <Text style={styles.buttonText}>Concluir todas tarefas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.footerButtons, { backgroundColor: THEME.COLORS.DANGER }]}
                        onPress={handleRemoveAllTasks}
                    >
                        <Ionicons name="trash-outline" size={28} color={THEME.COLORS.GRAY_200} />
                        <Text style={styles.buttonText}>Remover todas tarefas</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

        </View>
    );
}