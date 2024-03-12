import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import CheckBox from "expo-checkbox";
import { ThemeColors } from "../assets/ThemeColors";

const Preferences = ({ route }) => {
  const navigation = useNavigation();
  const [selectedSkill, setSelectedSkill] = useState(null);
  console.log("data from register?", route.params);

  let [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const moveToPreferences2 = () => {
    console.log("called movetoPreferences2");
    navigation.navigate("Preferences2", {
      data: {
        ...route.params.data,
        selectedSkill: selectedSkill,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.preferenceText}>
        Select your skill level to get started
      </Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Beginner")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Beginner"}
            onValueChange={() => setSelectedSkill("Beginner")}
            color={
              selectedSkill === "Beginner" ? "orange" : ThemeColors.tertiary
            }
          />
          <View>
            <Text style={styles.skills}>Beginner</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              You are new to the gym with less than a year of experience.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Intermediate")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Intermediate"}
            onValueChange={() => setSelectedSkill("Intermediate")}
            color={
              selectedSkill === "Intermediate" ? "orange" : ThemeColors.tertiary
            }
          />
          <View>
            <Text style={styles.skills}>Intermediate</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              You have been lifing consistently for a few years.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setSelectedSkill("Professional")}
        >
          <CheckBox
            style={styles.checkbox}
            value={selectedSkill === "Professional"}
            onValueChange={() => setSelectedSkill("Professional")}
            color={
              selectedSkill === "Professional" ? "orange" : ThemeColors.tertiary
            }
          />
          <View>
            <Text style={styles.skills}>Professional</Text>
            <Text style={[styles.skills, { fontSize: 15, paddingTop: 10 }]}>
              You have been lifing consistently for a many years, you know your
              stuff and probably compete.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Button
        textSize={22}
        width={250}
        height={50}
        text={"Next"}
        onPress={moveToPreferences2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    width: "100%",
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  checkboxItem: {
    marginHorizontal: 20,
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    color: ThemeColors.tertiary,
  },
  checkbox: {
    alignSelf: "center",
    width: 35,
    height: 35,
  },
  preferenceText: {
    paddingTop: 50,
    fontSize: 25,
    marginBottom: 40,
    color: ThemeColors.tertiary,
    textAlign: "center",
  },
  skills: {
    fontSize: 20,
    paddingRight: 10,
    fontFamily: "DMRegular",
    paddingLeft: 20,
    color: ThemeColors.tertiary,
  },
  NextBtnText: {
    backgroundColor: ThemeColors.secondary,
    color: ThemeColors.tertiary,
    fontSize: 30,
    padding: 10,
    borderRadius: 25,
    textShadowColor: ThemeColors.quaternary,
    fontFamily: "DMBold",
  },
});

export default Preferences;
