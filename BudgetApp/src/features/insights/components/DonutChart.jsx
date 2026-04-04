import { Text, View } from "react-native";
import C from "../../../constants/colors";
import Svg, { Circle, G } from "react-native-svg";

export default function DonutChart({ data, total }) {
  const SIZE = 120;
  const R = 42;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const CIRC = 2 * Math.PI * R;
  const GAP = 3;

  let offset = 0;

  const slices = data.map((item) => {
    const pct = item.pct / 100;
    const dash = CIRC * pct - GAP;

    const slice = {
      ...item,
      dash,
      offset,
    };

    offset += CIRC * pct;
    return slice;
  });

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE}>
        <G rotation="-90" origin={`${CX},${CY}`}>
          {slices.map((s, i) => (
            <Circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={15}
              strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </G>
      </Svg>

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "800", color: C.dark }}>
          {total}
        </Text>
        <Text style={{ fontSize: 10, color: C.muted }}>total</Text>
      </View>
    </View>
  );
}
