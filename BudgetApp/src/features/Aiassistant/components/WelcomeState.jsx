import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import QUICK_PROMPTS from "../constants/Quickprompt";
import C from "../../../constants/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHIP_GAP = 10;
const CHIP_H_PAD = 16;
const CHIP_WIDTH = (SCREEN_WIDTH - CHIP_H_PAD * 2 - CHIP_GAP) / 2;

function QuickChip({ chip, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(chip.label)}
      activeOpacity={0.78}
      style={{
        width: CHIP_WIDTH,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: chip.bg,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: `${chip.color}30`,
        shadowColor: chip.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          backgroundColor: `${chip.color}18`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={chip.icon} size={13} color={chip.color} />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: chip.color,
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        {chip.label}
      </Text>
    </TouchableOpacity>
  );
}
export default function WelcomeState({ onChipPress }) {
  // Build pairs for 2-per-row layout
  const rows = [];
  for (let i = 0; i < QUICK_PROMPTS.length; i += 2) {
    rows.push(QUICK_PROMPTS.slice(i, i + 2));
  }

  return (
    <View style={{ paddingHorizontal: CHIP_H_PAD, paddingTop: 20 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "800",
          color: C.dark,
          marginBottom: 4,
        }}
      >
        Ask me anything 👋
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: C.faint,
          marginBottom: 18,
          lineHeight: 18,
        }}
      >
        I can analyse your spending, suggest savings, and help you stay on
        budget.
      </Text>

      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: C.muted,
          marginBottom: 10,
          letterSpacing: 0.5,
        }}
      >
        QUICK PROMPTS
      </Text>

      {/* 2-per-row chip grid */}
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={{
            flexDirection: "row",
            gap: CHIP_GAP,
            marginBottom: CHIP_GAP,
          }}
        >
          {row.map((chip) => (
            <QuickChip key={chip.label} chip={chip} onPress={onChipPress} />
          ))}
        </View>
      ))}

      {/* Data context card */}
      <View
        style={{
          marginTop: 14,
          backgroundColor: C.white,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: C.border,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: C.primaryPale,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="shield-checkmark" size={16} color={C.primary} />
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: C.dark }}>
              Connected to your data
            </Text>
            <Text style={{ fontSize: 11, color: C.faint }}>
              AI reads your transactions privately
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[
            {
              label: "transactions",
              icon: "receipt",
              color: C.primary,
              bg: C.primaryPale,
            },
            {
              label: "income",
              icon: "trending-up",
              color: C.green,
              bg: C.greenBg,
            },
            {
              label: "spent",
              icon: "trending-down",
              color: C.red,
              bg: C.redBg,
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: stat.bg,
                borderRadius: 12,
                padding: 10,
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name={stat.icon} size={14} color={stat.color} />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: stat.color,
                  textAlign: "center",
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
