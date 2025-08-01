import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { recipeCardStyles } from "../assets/styles/home.styles";
import { Image } from "expo-image";


export default function RecipeCard ({recipe}){
    const router = useRouter();
    return (
        <TouchableOpacity
        style={recipeCardStyles.container}
        onPress={()=>router.push(`/recipe/${recipe/id}`)}
        activeOpacity={0.8}
        >
            <View style={recipeCardStyles.imageContainer}>
                <Image 
                source={{uri: recipe.image}}
                style={recipeCardStyles.image}
                contentFit="cover"
                transition={300}
                />
            </View>
            <View style={recipeCardStyles.content}>
                <Text style={recipeCardStyles.title}numberOfLines={2}>
                    {recipe.title}
                </Text>
                {recipe.description && (
                    <Text style={recipeCardStyles.description} numberOfLines={2}>
                        {recipe.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

