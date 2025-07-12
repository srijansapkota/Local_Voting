toast.success("Account created successfully!", {
                  position: "top-center",
                });
              }
              return user;
            } catch (error) {
              toast.error("error.message", {
                position: "top-center",
              });
              throw error;
            }
          }