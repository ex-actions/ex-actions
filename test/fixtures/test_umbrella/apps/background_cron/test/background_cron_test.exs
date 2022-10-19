defmodule BackgroundCronTest do
  use ExUnit.Case
  doctest BackgroundCron

  test "greets the world" do
    assert BackgroundCron.hello() == :world
  end
end
