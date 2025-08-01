import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI.js";
import LoadingSpinner from '../../components/LoadingSpinner'
import {homeStyles} from '../../assets/styles/home.styles.js'
import { COLORS } from "../../constants/colors.js";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import RecipeCard from "../../components/RecipeCard.jsx";

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefresing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured);

    } catch (error) {
      console.log("Error loading the data:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const loadCategoryData = async(category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals.map((meal) => MealAPI.transformMealData(meal)).filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async(category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  }

  const onRefresh = async() => {
    setRefresing(true);
    // await sleep(2000);
    await loadData();
    setRefresing(false);
  }

  useEffect(() => {
    loadData();
  },[]);

  if (loading && !refreshing) return <LoadingSpinner message='Loading delicious recipes...'/>


  return (
    <View style={homeStyles.container}>
      <ScrollView showsVerticalScrollIndicator = {false} 
      refreshControl={
        <RefreshControl refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={COLORS.primary}
        />
      }
      contentContainerStyle = {homeStyles.scrollContent}
      >

        {/* Animal icons */}
        <View style={homeStyles.welcomeSection}>
          <Image source={require("../../assets/images/lamb.png")} 
          style = {{
            width: 100,
            height: 100,
          }}
          />

          <Image source={require("../../assets/images/fish.png")} 
          style = {{
            width: 100,
            height: 100,
          }}
          />

          <Image source={require("../../assets/images/chicken.png")} 
          style = {{
            width: 100,
            height: 100,
          }}
          />
        </View>

        {/* Featured section */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity style={homeStyles.featuredCard} activeOpacity={0.9} onPress={() =>router.push(`/recipe/${featuredRecipe.id}`)}
            
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image source={{uri: featuredRecipe.image}} 
                style={homeStyles.featuredImage}
                contentFit='cover'
                transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredMeta}>
                    <View style={homeStyles.metaItem}>
                      <Ionicons name="location-outline" size={16} color={COLORS.white} />
                      <Text style={homeStyles.metaText} >{featuredRecipe.area}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 &&(
          <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect}/>
        )}

        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory}
            </Text>
          </View>

          {recipes.length > 0 ? (
            <FlatList 
            data={recipes}
            renderItem={({item})=><RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.recipesGrid}
            scrollEnabled={false}

            />
          ) : (
            <View></View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
