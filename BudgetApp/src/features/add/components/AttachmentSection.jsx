import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import getFileIcon from "./getFileIcon";
import SectionLabel from "./SectionLabel";


export default function AttachmentSection({ attachment, accentColor, onPickImage, onPickDocument, onRemove }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <SectionLabel text="Attachment" optional />

  
      {!attachment ? (
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Pick image */}
          <TouchableOpacity
            onPress={onPickImage}
            activeOpacity={0.75}
            style={{
              flex: 1, flexDirection: "row", alignItems: "center",
              justifyContent: "center", gap: 6,
              backgroundColor: "#f9fafb",
              borderWidth: 1.5, borderColor: "#e5e7eb",
              borderStyle: "dashed", borderRadius: 14, paddingVertical: 14,
            }}
          >
            <Ionicons name="image-outline" size={18} color={accentColor} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: accentColor }}>
              Image
            </Text>
          </TouchableOpacity>

          {/* Pick document */}
          <TouchableOpacity
            onPress={onPickDocument}
            activeOpacity={0.75}
            style={{
              flex: 1, flexDirection: "row", alignItems: "center",
              justifyContent: "center", gap: 6,
              backgroundColor: "#f9fafb",
              borderWidth: 1.5, borderColor: "#e5e7eb",
              borderStyle: "dashed", borderRadius: 14, paddingVertical: 14,
            }}
          >
            <Ionicons name="document-attach-outline" size={18} color={accentColor} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: accentColor }}>
              Document
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Attachment preview card
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: "#f5f3ff",
          borderWidth: 1.5, borderColor: accentColor + "44",
          borderRadius: 14, padding: 12, gap: 12,
        }}>
  
          {attachment.type === "image" ? (
            <Image
              source={{ uri: attachment.uri }}
              style={{ width: 48, height: 48, borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{
              width: 48, height: 48, borderRadius: 10,
              backgroundColor: "#ede9fe", alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name={getFileIcon(attachment.name)} size={22} color={accentColor} />
            </View>
          )}

          {/* File name */}
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 13, fontWeight: "600", color: "#374151" }}
          >
            {attachment.name}
          </Text>

          {/* Remove button */}
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              width: 26, height: 26, borderRadius: 13,
              backgroundColor: "#fecaca", alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={14} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}