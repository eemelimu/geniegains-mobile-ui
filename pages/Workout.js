import React, { useState, useEffect, useContext } from "react";
import { useLocalization } from "../contexts/LocalizationContext";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalDropdown from "react-native-modal-dropdown";
import { useAuth } from "../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "../assets/config";
import { ThemeContext } from "../contexts/ThemeContext";
import { LogBox } from "react-native";
import useRequest from "../hooks/useRequest";

export const Workout = ({ route }) => {
  const [sets, setSets] = useState(
    route?.params?.from === "home" ? [] : [{ weight: "", reps: "" }]
  );
  const { t, locale } = useLocalization();
  const { state } = useAuth();
  const token = state.token;
  const { fetcher } = useRequest(token);
  LogBox.ignoreAllLogs();
  const { theme: ThemeColors } = useContext(ThemeContext);
  //styles dont move
  const styles = StyleSheet.create({
    // Single Movement Styles
    singleMovementContainer: {
      flex: 1,
      padding: 20,
      marginBottom: 20,
    },
    singleMovementRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    singleMovementColumn: {
      flexDirection: "column",
    },
    singleMovementLabel: {
      marginBottom: 2,
      top: 5,
      paddingLeft: 5,
      paddingRight: 5,
    },
    singleMovementInput: {
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      padding: 7,
      textAlign: "center",
      marginTop: 5,
      width: 60,
    },
    singleMovementTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    singleMovementReps: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 40,
      left: 10,
    },
    singleMovementSets: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 70,
      left: 10,
    },
    addSetButton: {
      backgroundColor: ThemeColors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    removeIcon: {
      position: "absolute",
      right: 10,
      color: ThemeColors.tertiary,
    },
    // Add Movement Styles
    addMenu: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    addMenuItem: {
      marginHorizontal: 10,
    },
    addedMovements: {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: ThemeColors.primary,
      paddingBottom: 20,
    },
    inputContainer: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    label: {
      marginBottom: 20,
      top: 15,
      paddingHorizontal: 10,
      color: ThemeColors.tertiary,
    },
    input: {
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      padding: 10,
      textAlign: "center",
      color: ThemeColors.tertiary,
      width: 150,
    },
    line: {
      left: 0,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
      width: "100%",
      marginBottom: 20,
      paddingBottom: 20,
    },
    dropdownText: {
      fontSize: 16,
      padding: 10,
      borderWidth: 1,
      color: ThemeColors.tertiary,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      backgroundColor: ThemeColors.secondary,
      textAlign: "center",
    },
    dropdown: {
      marginTop: 2,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      width: 144,
      backgroundColor: ThemeColors.secondary,
    },
    addExercise: {
      backgroundColor: ThemeColors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderColor: ThemeColors.quaternary,
      borderWidth: 3,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      bottom: 5,
    },
    finishWorkout: {
      backgroundColor: ThemeColors.secondary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    regularText: {
      color: ThemeColors.tertiary,
    },
  });

  const [name, setName] = useState(
    t("workout-example-name", {
      date: new Date().toLocaleDateString(locale.languageTag, {
        month: "numeric",
        day: "numeric",
      }),
    })
  );
  const [notes, setNotes] = useState("");
  const [movements, setMovements] = useState([]);
  const [addedMovements, setAddedMovements] = useState([]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [workoutData, setWorkoutData] = useState([]);
  const navigation = useNavigation();
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    const asyncRouteHandler = async () => {
      if (route.params) {
        if (route.params?.from === "routines") {
          setName(route.params.movements.training_plan_name);
          setAddedMovements(route.params.movements.movements);
          setWorkoutData(route.params.movements.movements);
        } else if (route.params?.from === "home") {
          const id = route.params.id;
          const res = await fetcher({
            url: BACKEND_URL + `exercise/${id}`,
            reqMethod: "GET",
            errorMessage: t("something-went-wrong"),
            showLoading: true,
          });

          if (!res) return;
          setName(res.name);
          setNotes(res.note);

          const movements = await fetcher({
            url: BACKEND_URL + `exercisemovementconnection/${id}`,
            reqMethod: "GET",
            errorMessage: t("something-went-wrong"),
            showLoading: true,
          });
          if (!movements) return;
          setAddedMovements(movements.emcs_list);
          setWorkoutData(movements.emcs_list);
          console.log(movements.emcs_list);
          movements.emcs_list.map((movement, index) => {
            if (index == 0) {
              setSets([{ weight: movement.weight, reps: movement.reps }]);
            }
            setSets([
              ...sets,
              { weight: movement.weight, reps: movement.reps.toString() },
            ]);
          });
          console.log(sets);
        }
      }
    };
    asyncRouteHandler();
  }, [route.params]);

  const handleAddMovement = (value) => {
    const selectedMovementFilter = movements.filter(
      (movement) => movement.name === value
    );
    console.log(selectedMovementFilter);
    if (addedMovements.includes(selectedMovementFilter[0])) {
      setDropdownKey((prevKey) => prevKey + 1);
      return;
    }
    setAddedMovements([...addedMovements, selectedMovementFilter[0]]);
    setDropdownKey((prevKey) => prevKey + 1);
    setWorkoutData([selectedMovementFilter[0], ...workoutData]);
  };

  const handleRemoveMovement = (movement) => {
    const newMovements = addedMovements.filter(
      (addedMovement) => addedMovement.id !== movement.id
    );
    setAddedMovements(newMovements);
    setWorkoutData(workoutData.filter((data) => data.id !== movement.id));
  };

  const createExercise = async (name, notes) => {
    try {
      const res = await fetch(BACKEND_URL + "exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          name: name,
          note: notes,
          type: name,
        }),
      });
      const data = await res.json();
      return data.id;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const allWorkoutsHaveSets = workoutData.every((workout) => {
      return (
        Array.isArray(workout.sets) &&
        workout.sets.every((set) => set.weight !== "" && set.reps !== "")
      );
    });
    console.log(allWorkoutsHaveSets);
    workoutData.length > 0 && allWorkoutsHaveSets
      ? setInProgress(true)
      : setInProgress(false);
  }, [workoutData]);

  const addSetsToExercise = async (exerciseId, sets, movement) => {
    try {
      const res = await fetch(BACKEND_URL + `exercisemovementconnection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          movement_id: movement.id,
          weight: sets.weight,
          reps: sets.reps,
          time: 0,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleFinishWorkout = async () => {
    if (inProgress) {
      try {
        const exerciseId = await createExercise(name, notes);
        await Promise.all(
          workoutData.map(async (movement) => {
            await Promise.all(
              movement.sets.map(async (set) => {
                await addSetsToExercise(exerciseId, set, movement);
              })
            );
          })
        );
      } catch (error) {
        console.log("Error: ", error);
      }
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    try {
      fetch(BACKEND_URL + "movement", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMovements(data.movement_list);
          console.log(data);
        })
        .catch((error) => {
          console.log("Error fetching movements: ", error);
        });
    } catch (error) {
      console.log("Error fetching movements: ", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("name")}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder={t("workout-name")}
            placeholderTextColor={ThemeColors.tertiary}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("notes")}</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={(text) => setNotes(text)}
            placeholder={t("notes")}
            placeholderTextColor={ThemeColors.tertiary}
          />
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.addMenu}>
        <View style={styles.addMenuItem}>
          <ModalDropdown
            key={dropdownKey}
            options={movements.map((movement) => movement.name)}
            onSelect={(index, value) => {
              handleAddMovement(value);
            }}
            defaultValue={t("select-movements")}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdown}
            dropdownTextStyle={{
              color: ThemeColors.tertiary,
              backgroundColor: ThemeColors.primary,
              fontSize: 16,
            }}
            dropdownTextHighlightStyle={{
              color: ThemeColors.tertiary,
              backgroundColorThemeColors: ThemeColors.quaternary,
            }}
          />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.addedMovements}>
          {addedMovements.length > 0 ? (
            addedMovements.map((movement) => (
              <SingleMovement
                key={movement.id}
                movement={movement}
                handleRemoveMovement={handleRemoveMovement}
                workoutData={workoutData}
                setSets={setSets}
                sets={sets}
                setWorkoutData={setWorkoutData}
              />
            ))
          ) : (
            <Text style={styles.regularText}>{t("no-exercises")}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {inProgress && route?.params?.from !== "home" ? (
          <TouchableOpacity
            style={{
              ...styles.finishWorkout,
              visibility: inProgress ? "visible" : "hidden",
            }}
            onPress={handleFinishWorkout}
          >
            <Text style={styles.regularText}>{t("finish-workout")}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const SingleMovement = ({
  movement,
  handleRemoveMovement,
  workoutData,
  setWorkoutData,
  setSets,
  sets,
}) => {
  //styles dont move
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const styles = StyleSheet.create({
    // Single Movement Styles
    singleMovementContainer: {
      backgroundColor: ThemeColors.secondary,
      borderRadius: 5,
      flex: 1,
      padding: 20,
      marginBottom: 20,
    },
    singleMovementRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      marginBottom: 5,
      color: ThemeColors.tertiary,
    },
    singleMovementColumn: {
      flexDirection: "column",
    },
    singleMovementLabel: {
      marginBottom: 2,
      top: 5,
      paddingLeft: 5,
      paddingRight: 5,
    },
    singleMovementInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 7,
      textAlign: "center",
      marginTop: 5,
      width: 60,
    },
    singleMovementTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: ThemeColors.tertiary,
    },
    singleMovementReps: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 40,
      left: 10,
    },
    singleMovementSets: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 70,
      left: 10,
    },
    addSetButton: {
      backgroundColor: ThemeColors.secondary,
      borderColor: ThemeColors.quaternary,
      borderWidth: 3,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    addSetButtonText: {
      color: ThemeColors.tertiary,
      fontWeight: "bold",
      fontSize: 16,
    },
    deleteMovementIcon: {
      position: "absolute",
      right: 5,
      top: 10,
      padding: 10,
    },
  });

  //end of styles dont move

  const handleAddSet = () => {
    setSets([...sets, { weight: "", reps: "" }]);
    if (workoutData.includes(movement)) {
      const index = workoutData.indexOf(movement);
      const newWorkoutData = [...workoutData];
      newWorkoutData[index].sets = sets;
      setWorkoutData(newWorkoutData);
    }
  };

  const handleSetOnChange = (index, text) => {
    const newSets = [...sets];
    newSets[index] = text;
    setSets(newSets);
    if (workoutData.includes(movement)) {
      const index = workoutData.indexOf(movement);
      const newWorkoutData = [...workoutData];
      newWorkoutData[index].sets = sets;
      setWorkoutData(newWorkoutData);
    }
  };

  const handleRemoveSet = (index) => {
    index >= 1 ? setSets(sets.filter((set, i) => i !== index)) : null;
    if (index >= 1) {
      const newWorkoutData = [...workoutData];
      newWorkoutData[workoutData.indexOf(movement)].sets = sets.filter(
        (set, i) => i !== index
      );
      setWorkoutData(newWorkoutData);
    }
  };

  const handleRepsChange = (index, text) => {
    const newSets = [...sets];
    newSets[index].reps = text;
    setSets(newSets);
  };

  const handleWeightChange = (index, text) => {
    const newSets = [...sets];
    newSets[index].weight = text;
    setSets(newSets);
  };

  return (
    <View style={styles.singleMovementContainer}>
      <Text style={styles.singleMovementTitle}>{movement.name}</Text>
      <TouchableOpacity
        onPress={() => handleRemoveMovement(movement)}
        style={styles.deleteMovementIcon}
      >
        <MaterialIcons
          name="delete-outline"
          size={24}
          color={ThemeColors.tertiary}
        />
      </TouchableOpacity>
      {sets.map((set, index) => (
        <SingleSet
          key={index}
          set={set}
          setWeight={(text) => handleWeightChange(index, text)}
          setReps={(text) => handleRepsChange(index, text)}
          setNumber={index + 1}
          handleRemoveSet={() => handleRemoveSet(index)}
          handleSetOnChange={() => handleSetOnChange(index)}
        />
      ))}
      <View>
        <Pressable
          onPress={handleAddSet}
          style={styles.addSetButton}
          color={ThemeColors.secondary}
        >
          <Text style={styles.addSetButtonText}>{t("add-set")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const SingleSet = ({
  set,
  setWeight,
  setReps,
  setNumber,
  handleRemoveSet,
  handleSetOnChange,
}) => {
  const { t } = useLocalization();
  const { theme: ThemeColors } = useContext(ThemeContext);
  const { weight, reps } = set;

  //styles dont move

  const styles = StyleSheet.create({
    // Single Movement Styles
    singleMovementContainer: {
      flex: 1,
      padding: 20,
      marginBottom: 20,
    },
    singleMovementRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    singleMovementColumn: {
      flexDirection: "column",
    },
    singleMovementLabel: {
      // width: 60,
      color: ThemeColors.tertiary,
      marginBottom: 2,
      top: 5,
      paddingLeft: 5,
      paddingRight: 5,
    },
    singleMovementInput: {
      borderWidth: 1,
      borderColor: ThemeColors.quaternary,
      borderRadius: 5,
      padding: 7,
      textAlign: "center",
      marginTop: 5,
      width: 60,
      color: ThemeColors.tertiary,
    },
    singleMovementTitle: {
      color: ThemeColors.tertiary,
      fontSize: 18,
      fontWeight: "bold",
    },
    singleMovementReps: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 40,
      color: ThemeColors.tertiary,
      left: 10,
    },
    singleMovementSets: {
      fontSize: 14,
      marginBottom: 5,
      alignSelf: "center",
      position: "absolute",
      top: 70,
      left: 10,
    },
    addSetButton: {
      backgroundColor: "#D8D8D8",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    removeIcon: {
      marginLeft: 10,
    },
  });

  //end of styles dont move
  return (
    <View>
      <View style={styles.singleMovementRow}>
        <Text style={styles.singleMovementLabel}>{setNumber}.</Text>
        <Text style={styles.singleMovementLabel}>{t("weight")}</Text>
        <TextInput
          style={styles.singleMovementInput}
          value={weight}
          onChangeText={(text) => setWeight(text)}
          placeholder={t("weight")}
          keyboardType="numeric"
          placeholderTextColor={ThemeColors.tertiary}
          onChange={handleSetOnChange}
        />
        <Text style={styles.singleMovementLabel}>{t("reps")}</Text>
        <TextInput
          style={styles.singleMovementInput}
          value={reps}
          onChangeText={(text) => setReps(text)}
          placeholder={t("reps")}
          keyboardType="numeric"
          placeholderTextColor={ThemeColors.tertiary}
          onChange={handleSetOnChange}
        />
        <TouchableOpacity style={styles.removeIcon} onPress={handleRemoveSet}>
          <Ionicons name="remove" size={24} color={ThemeColors.tertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
