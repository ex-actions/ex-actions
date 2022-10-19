defmodule BackgroundServiceTest do
  use ExUnit.Case
  doctest BackgroundService

  test "greets the world" do
    assert BackgroundService.hello() == :world
  end
end
