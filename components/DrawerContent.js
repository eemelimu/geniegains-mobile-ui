import React, { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { storeData } from "../assets/utils/utils";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useAuth } from "./AuthContext";
import { ThemeContext } from "./ThemeContext";
// TODO
// - FEEDBACK: Animoi inputin avaaminen ja sulkeminen
// - FEEDBACK: Lähetä palautetta toiminnallisuus
// - FEEDBACK: Feedback Sent -viesti ja sen animointi

const ThemeBtn = ({ colors, name }) => {
  const { theme: ThemeColors, changeThemeColor } = useContext(ThemeContext);

  const handleThemeChange = (colors) => {
    console.log("changing theme");
    storeData("theme", {
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
    });
    changeThemeColor({
      primary: colors[0],
      secondary: colors[1],
      tertiary: colors[2],
      quaternary: colors[3],
    });
  };

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      width: 70,
      height: 60,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      padding: 10,
      borderRadius: 10,
      margin: 5,
      width: 50,
      height: 40,
    },
    text: {
      fontSize: 16,
      color: ThemeColors.tertiary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          handleThemeChange(colors);
        }}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        ></LinearGradient>
        <Text style={styles.text}>{name}</Text>
      </Pressable>
    </View>
  );
};

export const DrawerContent = () => {
  const { theme: ThemeColors } = useContext(ThemeContext);
  const [feedbackInputVisible, setFeedbackInputVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackWarning, setFeedbackWarning] = useState(false);
  const navigation = useNavigation();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  const handleAbout = () => {
    navigation.navigate("About");
  };
  const handleSendFeedback = () => {
    if (feedbackText.length > 0) {
      // Luo toiminnallisuus lähettää palautetta
      setFeedbackText("");
      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackSent(false);
      }, 3000);
      setFeedbackInputVisible(false);
    } else {
      setFeedbackWarning(true);
      setTimeout(() => {
        setFeedbackWarning(false);
      }, 3000);
    }
  };

  const styles = StyleSheet.create({
    drawerContainer: {
      marginTop: 50,
      flex: 1,
      backgroundColor: ThemeColors.primary,
    },
    sendFeedBackItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    sendFeedBackItemSent: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: ThemeColors.quaternary,
      borderRadius: 10,
      alignSelf: "center",
      marginTop: 10,
    },
    sendFeedbackInput: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: ThemeColors.secondary,
      width: 250,
      borderRadius: 5,
      marginHorizontal: 5,
      textAlign: "center",
      fontStyle: "italic",
      color: ThemeColors.tertiary,
      alignSelf: "center",
    },
    drawerItem: {
      fontSize: 25,
      padding: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
      flexDirection: "row",
      alignItems: "center",
    },
    drawerFooterItem: {
      fontSize: 25,
      padding: 15,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    drawerItemIcon: {
      marginRight: 10,
    },
    drawerFooter: {
      position: "absolute",
      bottom: 10,
      width: "100%",
    },
    regularText: {
      fontSize: 16,
      color: ThemeColors.tertiary,
    },
    row: {
      maxWidth: "100%",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "flex-start",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: ThemeColors.quaternary,
    },
  });

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => console.log("Navigoi profiili sivulle.")}
      >
        <AntDesign
          name="user"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          console.log("Navigoi aseukset sivulle.");
          navigation.navigate("Settings");
        }}
      >
        <Feather
          name="settings"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          console.log(
            "Päättäkää onko FAQ vai Help and Support. Uuden sivun luonti ja navigointi sinne."
          )
        }
      >
        <MaterialIcons
          name="support-agent"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>Help and Support / FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => handleAbout()}>
        <Entypo
          name="help"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => setFeedbackInputVisible(!feedbackInputVisible)}
      >
        <AntDesign
          name="mail"
          size={24}
          color={ThemeColors.tertiary}
          style={styles.drawerItemIcon}
        />
        <Text style={styles.regularText}>Send Feedback</Text>
      </TouchableOpacity>
      {feedbackInputVisible && (
        <View style={styles.sendFeedBackItem}>
          <TextInput
            style={[
              styles.sendFeedbackInput,
              feedbackWarning && { borderWidth: 1, borderColor: "red" },
            ]}
            placeholder="What's on your mind?"
            onChangeText={setFeedbackText}
            placeholderTextColor={ThemeColors.tertiary}
          />
          <TouchableOpacity onPress={handleSendFeedback}>
            <Feather
              name="send"
              size={24}
              color={ThemeColors.tertiary}
              style={{ fontSize: 22 }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.row}>
        <ThemeBtn
          colors={["#000000", "#090b0e", "#b8bfc9", "#797979"]}
          name="Midnight"
        />
        <ThemeBtn
          colors={["#4c669f", "#3b5998", "#192f6a", "#192f6a"]}
          name="Deep Sea"
        />
        <ThemeBtn
          colors={["#f9d423", "#e65c00", "#333333", "#333333"]}
          name="Sunset"
        />
        <ThemeBtn
          colors={["#f8f9fa", "#e9ecef", "#212529", "#495057"]}
          name="Light"
        />
        <ThemeBtn
          colors={["#fffacd", "#ffffe0", "#e6d150", "#e6b800"]}
          name="Lemon Sorbet"
        />

        <ThemeBtn
          colors={["#f5f5f5", "#ffe4e1", "#ffc0cb", "#ffb6c1"]}
          name="Rose Quartz"
        />
        <ThemeBtn
          colors={["#fff8dc", "#fffacd", "#d4b996", "#ffb6c1"]}
          name="Buttercream"
        />
      </View>
      {feedbackSent && (
        <View style={styles.sendFeedBackItemSent}>
          <Text style={styles.regularText}>Feedback Sent</Text>
        </View>
      )}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerFooterItem}
          onPress={handleLogout}
        >
          <SimpleLineIcons
            name="logout"
            size={24}
            color={ThemeColors.tertiary}
            style={styles.drawerItemIcon}
          />
          <Text style={{ fontWeight: "bold", color: ThemeColors.tertiary }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
