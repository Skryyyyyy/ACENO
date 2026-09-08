cmake_minimum_required(VERSION 3.10.2)
project(sdap_core)

set(CMAKE_CXX_STANDARD 17)

add_library(sdap_core SHARED
    dsp_core.cpp
    feature_extract.cpp
    cylinder_fit.cpp
)

find_library(log-lib log)
find_library(m-lib m)

target_link_libraries(sdap_core
    ${log-lib}
    ${m-lib}
)
