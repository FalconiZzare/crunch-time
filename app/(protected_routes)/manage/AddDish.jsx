"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { HardDriveUpload } from "lucide-react";
import SectionHeader from "@/app/(protected_routes)/manage/SectionHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Image from "next/image";
import { cn, triggerToast } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createDish } from "@/actions/createDish";

// Food Builder Pattern Implementation
class FoodItem {
  constructor(builder) {
    this.name = builder.name;
    this.description = builder.description;
    this.price = builder.price;
    this.type = builder.type;
    this.image = builder.image;
  }
}

class FoodBuilder {
  constructor() {
    this.name = "";
    this.description = "";
    this.price = "";
    this.type = "";
    this.image = null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setImage(image) {
    this.image = image;
    return this;
  }

  build() {
    return new FoodItem(this);
  }
}

// Factory for creating specialized food builders based on type
class FoodBuilderFactory {
  static getBuilder(type) {
    switch (type) {
      case "rice":
        return new RiceBuilder();
      case "curry":
        return new CurryBuilder();
      case "snacks":
        return new SnacksBuilder();
      case "desserts":
        return new DessertsBuilder();
      case "drinks":
        return new DrinksBuilder();
      case "street-food":
        return new StreetFoodBuilder();
      default:
        return new FoodBuilder();
    }
  }
}

// Specialized builders with default values or behavior
class RiceBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "rice";
    // Could set default values for rice items
  }
}

class CurryBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "curry";
    // Could set default values for curry items
  }
}

class SnacksBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "snacks";
    // Could set default values for snacks
  }
}

class DessertsBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "desserts";
    // Could set default values for desserts
  }
}

class DrinksBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "drinks";
    // Could set default values for drinks
  }
}

class StreetFoodBuilder extends FoodBuilder {
  constructor() {
    super();
    this.type = "street-food";
    // Could set default values for street food
  }
}

const AddDish = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentBuilder, setCurrentBuilder] = useState(new FoodBuilder());

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      type: ""
    }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      currentBuilder.setImage(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Update builder when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.type && value.type !== currentBuilder.type) {
        // Create a new builder of the appropriate type
        const newBuilder = FoodBuilderFactory.getBuilder(value.type);
        newBuilder
          .setName(value.name || "")
          .setDescription(value.description || "")
          .setPrice(value.price || "")
          .setImage(image);
        setCurrentBuilder(newBuilder);
      } else {
        // Update existing builder
        currentBuilder
          .setName(value.name || "")
          .setDescription(value.description || "")
          .setPrice(value.price || "");
      }
    });

    return () => {
      subscription.unsubscribe();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [form, previewUrl, currentBuilder, image]);

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationKey: ["createDish"],
    mutationFn: async (data) => {
      if (!data?.type || typeof data.type !== "string" || data.type.trim() === "") {
        throw new Error("Dish type is required.");
      }

      if (!image) {
        throw new Error("Dish image is required.");
      }

      // Build the final food item
      const foodItem = currentBuilder
        .setName(data.name)
        .setDescription(data.description)
        .setPrice(data.price)
        .setType(data.type)
        .setImage(image)
        .build();

      //Extract info out of builder
      //Next.js doesn't support passing Complex class, object to server action
      const formData = new FormData();
      formData.append("image", foodItem.image);
      formData.append("name", foodItem.name);
      formData.append("description", foodItem.description);
      formData.append("price", foodItem.price);
      formData.append("type", foodItem.type);

      return await createDish(formData);
    },
    onError: (error) => {
      triggerToast(error.message || "An error occurred. Please try again.", "error");
    },
    onSuccess: () => {
      triggerToast("Dish created successfully.");
      form.reset();
      setCurrentBuilder(new FoodBuilder());
      setImage(null);
      setPreviewUrl(null);
    }
  });

  return (
    <Container>
      <SectionHeader title={"Create A Dish"}>
        <HardDriveUpload className={"size-8 text-primary md:size-9"} />
      </SectionHeader>
      <div className={"flex items-center justify-center"}>
        {image ? (
          <div className={"size-[300px] rounded-xl border border-dashed border-primary"}>
            <Image
              src={previewUrl}
              alt={"Picture Preview"}
              height={300}
              width={300}
              className={"size-full rounded-xl object-cover object-center"}
            />
          </div>
        ) : (
          <div
            className={
              "mt-4 flex size-[300px] items-center justify-center rounded-xl border border-dashed border-primary"
            }
          >
            <p>No Image Selected!</p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 place-items-center gap-x-2 gap-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="w-full">
              <Label htmlFor="image">Picture</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                required
                className="mt-2 cursor-pointer border border-primary"
                onChange={handleFileChange}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Food name..."
                      {...field}
                      required
                      className="mt-1 border border-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Food description..."
                      {...field}
                      required
                      className="mt-1 border border-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a price..."
                      {...field}
                      required
                      className="mt-1 border border-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Food Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          "w-full border border-primary",
                          !field.value && "[&>span]:text-foreground [&>svg]:text-primary"
                        )}
                      >
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border border-primary/30">
                      <SelectGroup>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="curry">Curry</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                        <SelectItem value="drinks">Drinks</SelectItem>
                        <SelectItem value="street-food">Street Food</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button
              className="w-full md:w-[200px]"
              type="submit"
              disabled={form.formState.isSubmitting || isPending}
            >
              {isPending ? "Processing..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
};

export default AddDish;
