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

const AddDish = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationKey: ["createDish"],
    mutationFn: async (data) => {
      if (!data?.type || typeof data.type !== "string" || data.type.trim() === "") {
        throw new Error("Dish type is required.");
      }

      if (!image) {
        throw new Error("Dish image is required.");
      }

      const formData = new FormData();
      formData.append("image", image);
      return await createDish(data, formData);
    },
    onError: (error) => {
      triggerToast(error.message || "An error occurred. Please try again.", "error");
    },
    onSuccess: (_, values) => {
      triggerToast("Dish created successfully.");
      form.reset(values);
    }
  });

  return (
    <Container className={"mt-[3.4rem] md:mt-[4.5rem]"}>
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
